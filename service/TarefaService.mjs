const KEY = "tarefas";

export class TarefaService {
  salvarTodas(tarefas) {
    localStorage.setItem(KEY, JSON.stringify(tarefas));
  }

  buscarTodas() {
    const dados = localStorage.getItem(KEY);
    return dados ? JSON.parse(dados) : [];
  }
}