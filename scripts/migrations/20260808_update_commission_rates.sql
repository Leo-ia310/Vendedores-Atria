update public."Configuracion"
set
  "Valor" = case
    when "Clave" = 'comision_primera_venta' then '0.20'
    when "Clave" = 'comision_renovacion' then '0.10'
    else "Valor"
  end,
  "Descripcion" = case
    when "Clave" = 'comision_primera_venta' then 'Porcentaje de comisión sobre el primer pago'
    when "Clave" = 'comision_renovacion' then 'Porcentaje de comisión sobre pagos recurrentes'
    else "Descripcion"
  end,
  "FechaActualizacion" = now()::text
where "Clave" in ('comision_primera_venta', 'comision_renovacion');

insert into public."Configuracion" ("Clave", "Valor", "Descripcion", "FechaActualizacion")
values
  ('comision_primera_venta', '0.20', 'Porcentaje de comisión sobre el primer pago', now()::text),
  ('comision_renovacion', '0.10', 'Porcentaje de comisión sobre pagos recurrentes', now()::text)
on conflict ("Clave") do nothing;

update public."Preguntas"
set
  "Pregunta" = '¿Cuál es la comisión del primer pago?',
  "Opciones" = '["5%","10%","15%","20%"]',
  "RespuestaCorrecta" = '20%',
  "Explicacion" = 'Primer pago 20%, pago recurrente 10%.'
where "QuestionId" = 'q_mod13_1';

update public."Preguntas"
set
  "Pregunta" = '¿Cuál es la comisión por pago recurrente?',
  "Opciones" = '["5%","10%","15%","0%"]',
  "RespuestaCorrecta" = '10%',
  "Explicacion" = 'Los pagos recurrentes aprobados pagan 10%.'
where "QuestionId" = 'q_mod13_2';

update public."Preguntas"
set
  "Pregunta" = '¿Cuál es la comisión por pago recurrente?',
  "Opciones" = '["5%","10%","15%","0%"]',
  "RespuestaCorrecta" = '10%',
  "Explicacion" = 'Los pagos recurrentes aprobados pagan 10%.'
where "QuestionId" = 'q_final_10';
