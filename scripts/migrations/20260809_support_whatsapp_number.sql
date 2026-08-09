update public."Configuracion"
set
  "Valor" = '50588662303',
  "Descripcion" = coalesce(nullif("Descripcion", ''), 'WhatsApp de soporte'),
  "FechaActualizacion" = now()::text
where "Clave" = 'whatsapp_soporte';

insert into public."Configuracion" ("Clave", "Valor", "Descripcion", "FechaActualizacion")
select 'whatsapp_soporte', '50588662303', 'WhatsApp de soporte', now()::text
where not exists (
  select 1 from public."Configuracion" where "Clave" = 'whatsapp_soporte'
);
