import { TarefaController } from "./controller/TarefaController.mjs";

const controller = new TarefaController();
const $ = (id) => document.getElementById(id);

function renderTabela() {
  const lista = controller.listarTarefas();

  $("tbl-tarefas").innerHTML = lista.length === 0
    ? `<tr><td colspan="3" class="text-center text-muted">Nenhuma tarefa cadastrada.</td></tr>`
    : lista.map(t => linhaHTML(t)).join("");
}

function linhaHTML(t) {
  return `
    <tr>
      <td class="${t.concluida ? "text-decoration-line-through text-muted" : ""}">
        ${t.descricao}
      </td>
      <td>
        <span class="badge ${t.concluida ? "text-bg-success" : "text-bg-warning"}">
          ${t.concluida ? "Concluída" : "Pendente"}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editarTarefa('${t.id}')">Editar</button>
        <button class="btn btn-sm btn-outline-success me-1" onclick="alternarConclusao('${t.id}')">
          ${t.concluida ? "Desmarcar" : "Concluir"}
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="removerTarefa('${t.id}')">Excluir</button>
      </td>
    </tr>
  `;
}

function salvarTarefa(form) {
  const { descricao } = Object.fromEntries(new FormData(form));
  const id = form.dataset.editId;

  try {
    id
      ? controller.atualizarTarefa(id, { descricao })
      : controller.adicionarTarefa(descricao);

    alerta(id ? "Tarefa atualizada!" : "Tarefa criada!");
    resetForm(form);
    renderTabela();
  } catch (e) {
    alerta(e.message, "danger");
  }
}

function editarTarefa(id) {
  const t = controller.buscarPorId(id);
  if (!t) return;

  const form = $("form-tarefa");
  form.descricao.value = t.descricao;
  form.dataset.editId = id;
}

function removerTarefa(id) {
  if (!confirm("Excluir tarefa?")) return;
  controller.removerTarefa(id);
  renderTabela();
  alerta("Tarefa removida!");
}

function alternarConclusao(id) {
  controller.alternarConclusao(id);
  renderTabela();
}

function resetForm(form) {
  form.reset();
  delete form.dataset.editId;
}

function alerta(msg, tipo = "success") {
  const div = $("alerta");
  div.className = `alert alert-${tipo}`;
  div.textContent = msg;
  div.classList.remove("d-none");

  setTimeout(() => div.classList.add("d-none"), 3000);
}

Object.assign(window, {
  salvarTarefa,
  editarTarefa,
  removerTarefa,
  alternarConclusao
});

document.addEventListener("DOMContentLoaded", renderTabela);