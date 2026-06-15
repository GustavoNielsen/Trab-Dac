package com.example.ms_saga.service;

import com.example.ms_saga.config.RabbitConfig;
import com.example.ms_saga.dto.AprovacaoClienteMessages.AprovacaoClienteFalhouEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.AprovarClienteCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.ClienteAprovadoEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.ClienteAuthCriadoEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.ClientePendenteConsultadoEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.ContaAprovacaoCriadaEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.CriarClienteAuthCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.CriarContaAprovacaoCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.DashboardGerentesConsultadoEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.GerenteCargaResumo;
import com.example.ms_saga.dto.AprovacaoClienteMessages.GerentesListadosEvent;
import com.example.ms_saga.dto.AprovacaoClienteMessages.RemoverClienteAuthCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.RemoverContaAprovacaoCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.SolicitarDashboardGerentesCommand;
import com.example.ms_saga.dto.AprovacaoClienteMessages.SolicitarGerentesCommand;
import com.example.ms_saga.dto.ContaResponse;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class ClienteAprovacaoSagaOrchestrator {

    private final RabbitPublisher rabbitPublisher;
    private final SagaResultStore sagaResultStore;
    private final SagaStateStore sagaStateStore;
    private final EmailService emailService;

    public ClienteAprovacaoSagaOrchestrator(
            RabbitPublisher rabbitPublisher,
            SagaResultStore sagaResultStore,
            SagaStateStore sagaStateStore,
            EmailService emailService
    ) {
        this.rabbitPublisher = rabbitPublisher;
        this.sagaResultStore = sagaResultStore;
        this.sagaStateStore = sagaStateStore;
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitConfig.Q_CLIENTE_PENDENTE_EVT)
public void onClientePendenteConsultado(ClientePendenteConsultadoEvent event) {
    SagaStateStore.SagaState state = sagaStateStore.getOrCreate(event.sagaId());

    state.setCpf(event.cpf());
    state.setNome(event.nome());
    state.setEmail(event.email());
    state.setSalario(event.salario());
    state.setGerenteCpf(event.gerenteCpf());
    state.setContaCriacaoSolicitada(true);

    rabbitPublisher.publish(
            RabbitConfig.RK_CONTA_CRIAR_CMD,
            new CriarContaAprovacaoCommand(
                    event.sagaId(),
                    event.cpf(),
                    event.gerenteCpf(),
                    event.salario()
            )
    );
}

    @RabbitListener(queues = RabbitConfig.Q_GERENTES_LISTADOS_EVT)
    public void onGerentesListados(GerentesListadosEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.getOrCreate(event.sagaId());
        state.setGerentesDisponiveis(event.cpfs());
        tentarEscolherGerenteEProsseguir(event.sagaId(), event.cpf());
    }

    @RabbitListener(queues = RabbitConfig.Q_DASHBOARD_GERENTES_EVT)
    public void onDashboardGerentes(DashboardGerentesConsultadoEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.getOrCreate(event.sagaId());
        state.setCargasGerentes(event.gerentes());
        tentarEscolherGerenteEProsseguir(event.sagaId(), event.cpf());
    }

    private void tentarEscolherGerenteEProsseguir(String sagaId, String cpf) {
        SagaStateStore.SagaState state = sagaStateStore.get(sagaId);
        if (state == null) {
            return;
        }

        if (state.isContaCriacaoSolicitada()) {
            return;
        }

        if (state.getGerentesDisponiveis() == null || state.getCargasGerentes() == null) {
            return;
        }

        if (state.getGerentesDisponiveis().isEmpty()) {
            rabbitPublisher.publish(
                    RabbitConfig.RK_APROVACAO_FALHOU_EVT,
                    new AprovacaoClienteFalhouEvent(
                            sagaId,
                            cpf,
                            "Não foi possível aprovar o cliente. Nenhum gerente disponível."
                    )
            );
            return;
        }

        Map<String, Integer> qtdPorGerente = state.getCargasGerentes().stream()
                .collect(Collectors.toMap(
                        GerenteCargaResumo::gerenteCpf,
                        item -> item.quantidadeClientes() == null ? 0 : item.quantidadeClientes()
                ));

        String gerenteEscolhido = state.getGerentesDisponiveis().stream()
                .min(Comparator
                        .comparingInt((String gerenteCpf) -> qtdPorGerente.getOrDefault(gerenteCpf, 0))
                        .thenComparing(gerenteCpf -> gerenteCpf))
                .orElse(null);

        if (gerenteEscolhido == null) {
            rabbitPublisher.publish(
                    RabbitConfig.RK_APROVACAO_FALHOU_EVT,
                    new AprovacaoClienteFalhouEvent(
                            sagaId,
                            cpf,
                            "Não foi possível aprovar o cliente. Nenhum gerente disponível."
                    )
            );
            return;
        }

        state.setGerenteCpf(gerenteEscolhido);
        state.setContaCriacaoSolicitada(true);

        rabbitPublisher.publish(
                RabbitConfig.RK_CONTA_CRIAR_CMD,
                new CriarContaAprovacaoCommand(
                        sagaId,
                        state.getCpf(),
                        gerenteEscolhido,
                        state.getSalario()
                )
        );
    }

    @RabbitListener(queues = RabbitConfig.Q_CONTA_CRIADA_EVT)
    public void onContaCriada(ContaAprovacaoCriadaEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.getOrCreate(event.sagaId());

        ContaResponse conta = new ContaResponse(
                event.cliente(),
                event.numero(),
                event.saldo(),
                event.limite(),
                event.gerente(),
                event.criacao()
        );

        state.setConta(conta);

        rabbitPublisher.publish(
                RabbitConfig.RK_AUTH_CRIAR_CMD,
                new CriarClienteAuthCommand(
                        event.sagaId(),
                        state.getCpf(),
                        state.getNome(),
                        state.getEmail()
                )
        );
    }

    @RabbitListener(queues = RabbitConfig.Q_AUTH_CRIADO_EVT)
    public void onAuthCriado(ClienteAuthCriadoEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.getOrCreate(event.sagaId());
        state.setSenhaGerada(event.senhaGerada());

        rabbitPublisher.publish(
                RabbitConfig.RK_CLIENTE_APROVAR_CMD,
                new AprovarClienteCommand(
                        event.sagaId(),
                        event.cpf(),
                        state.getGerenteCpf(),
                        state.getConta().numero()
                )
        );
    }

    @RabbitListener(queues = RabbitConfig.Q_CLIENTE_APROVADO_EVT)
    public void onClienteAprovado(ClienteAprovadoEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.get(event.sagaId());
        if (state == null) {
            return;
        }

        emailService.enviarAprovacaoCliente(
                state.getEmail(),
                state.getNome(),
                state.getConta().numero(),
                state.getConta().limite(),
                state.getSenhaGerada()
        );

        sagaResultStore.concluirComSucesso(event.sagaId(), state.getConta());
        sagaStateStore.remove(event.sagaId());
    }

    private String motivoSaga(String motivoOriginal, String fallback) {
    return (motivoOriginal == null || motivoOriginal.isBlank())
            ? fallback
            : motivoOriginal;
}

    @RabbitListener(queues = RabbitConfig.Q_APROVACAO_FALHOU_EVT)
    public void onAprovacaoFalhou(AprovacaoClienteFalhouEvent event) {
        SagaStateStore.SagaState state = sagaStateStore.get(event.sagaId());

        if (state != null) {
            if (state.getSenhaGerada() != null) {
                rabbitPublisher.publish(
                        RabbitConfig.RK_AUTH_REMOVER_CMD,
                        new RemoverClienteAuthCommand(event.sagaId(), state.getCpf())
                );
            }

            if (state.getConta() != null) {
                rabbitPublisher.publish(
                        RabbitConfig.RK_CONTA_REMOVER_CMD,
                        new RemoverContaAprovacaoCommand(event.sagaId(), state.getConta().numero())
                );
            }

            try {
                emailService.enviarFalhaAutocadastro(
                        state.getEmail(),
                        state.getNome(),
                        motivoFalhaParaCliente(event.motivo())
                );
            } catch (Exception ignored) {
            }
        }

        String motivoTecnico = motivoSaga(
        event.motivo(),
        "Não foi possível aprovar o cliente. A solicitação foi cancelada."
);

sagaResultStore.concluirComFalha(event.sagaId(), motivoTecnico);
sagaStateStore.remove(event.sagaId());
    }

    private String motivoFalhaParaCliente(String motivoOriginal) {
        if (motivoOriginal == null || motivoOriginal.isBlank()) {
            return "Não foi possível efetuar a solicitação devido a uma falha interna no processamento.";
        }

        if (motivoOriginal.contains("Email já cadastrado")
                || motivoOriginal.contains("Login já cadastrado")
                || motivoOriginal.contains("CPF já cadastrado no auth")) {
            return "Não foi possível efetuar a solicitação por conflito nos dados de autenticação.";
        }

        return "Não foi possível efetuar a solicitação devido a uma falha interna no processamento.";
    }
}
