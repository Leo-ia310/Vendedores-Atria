import "server-only";

import { randomBytes } from "node:crypto";
import type { SalesConversationMessage, SalesEvaluation } from "@/lib/ai/sales-types";
import type { SalesSimulatorScenario } from "@/lib/content/sales-scenarios";
import { supabaseAdmin } from "@/lib/supabase/admin";

type SimulationUser = {
  UserId: string;
  CandidateId: string;
};

type SaveSimulationInput = {
  user: SimulationUser;
  scenario: SalesSimulatorScenario;
  messages: SalesConversationMessage[];
  evaluation: SalesEvaluation;
  startedAt?: string;
};

export async function saveSalesSimulation(input: SaveSimulationInput): Promise<string> {
  const timestamp = new Date().toISOString();
  const simulationId = id("sim");

  const { error } = await supabaseAdmin().from("Simulaciones").insert({
    SimulationAttemptId: simulationId,
    CandidateId: input.user.CandidateId,
    UserId: input.user.UserId,
    Escenario: input.scenario.id,
    ScenarioId: input.scenario.id,
    Difficulty: input.scenario.difficultyLevel,
    Status: "finished",
    StartedAt: input.startedAt || timestamp,
    FinishedAt: timestamp,
    Score: input.evaluation.score,
    Puntaje: input.evaluation.score,
    Messages: input.messages,
    Evaluation: input.evaluation,
    Respuestas: JSON.stringify(input.messages),
    Retroalimentacion: input.evaluation.summary || input.evaluation.recommendation,
    Fecha: timestamp,
    CreatedAt: timestamp,
    UpdatedAt: timestamp,
  } as never);

  if (error) throw new Error(error.message);
  return simulationId;
}

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}
