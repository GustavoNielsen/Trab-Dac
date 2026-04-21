<div class="modal-header">
  <h4 class="modal-title" id="modal-basic-title">Rejeitar Cliente</h4>
  <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('cancel')"></button>
</div>

<div class="modal-body">
  <p><strong>Nome:</strong> {{ cliente.nome }}</p>
  <p><strong>CPF:</strong> {{ cliente.cpf }}</p>
  <p><strong>Email:</strong> {{ cliente.email }}</p>

  <div class="mb-3">
    <label class="form-label">Por favor, digite o motivo da rejeição:</label>
    <textarea class="form-control" [(ngModel)]="motivoRejeicao"></textarea>
  </div>
</div>

<div class="modal-footer">
  <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss('cancel')">Fechar</button>
  <button type="button" class="btn btn-danger" (click)="confirmarRejeicao()">Confirmar Rejeição</button>
</div>
