import { Tarefa } from "../model/Tarefa.mjs";
import { TarefaService } from "../service/TarefaService.mjs";

const svc = new TarefaService();

export class TarefaController {
  adicionarTarefa(descricao) {
    const dados = { descricao };
    const erros = Tarefa.validar(dados);

    if (erros.length) {
      throw new Error(erros.join(" | "));
    }

    const lista = svc.buscarTodas();
    const tarefa = new Tarefa(dados);

    lista.push(tarefa);
    svc.salvarTodas(lista);

    return tarefa;
  }

  listarTarefas() {
    return svc.buscarTodas();
  }

  atualizarTarefa(id, novosDados) {
    const lista = svc.buscarTodas();

    const listaAtualizada = lista.map((tarefa) => {
      if (tarefa.id === id) {
        const tarefaAtualizada = { ...tarefa, ...novosDados, id };

        const erros = Tarefa.validar(tarefaAtualizada);
        if (erros.length) {
          throw new Error(erros.join(" | "));
        }

        return tarefaAtualizada;
      }

      return tarefa;
    });

    svc.salvarTodas(listaAtualizada);
  }

  removerTarefa(id) {
    const lista = svc.buscarTodas();
    const listaAtualizada = lista.filter((tarefa) => tarefa.id !== id);

    svc.salvarTodas(listaAtualizada);
  }

  alternarConclusao(id) {
    const lista = svc.buscarTodas();

    const listaAtualizada = lista.map((tarefa) => {
      if (tarefa.id === id) {
        return {
          ...tarefa,
          concluida: !tarefa.concluida
        };
      }

      return tarefa;
    });

    svc.salvarTodas(listaAtualizada);
  }

  buscarPorId(id) {
    return svc.buscarTodas().find((tarefa) => tarefa.id === id) ?? null;
  }
}