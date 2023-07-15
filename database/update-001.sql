ALTER TABLE public."Topics"
ADD COLUMN "lastAuthor" VARCHAR ,
ADD COLUMN "lastAuthorID" INTEGER ;

-- Actualiza los valores nulos en la columna "lastAuthor" con un valor por defecto (p. ej. 'Desconocido')
UPDATE public."Topics"
SET "lastAuthor" = 'Desconocido'
WHERE "lastAuthor" IS NULL;

-- Ahora puedes agregar la restricción NOT NULL a la columna "lastAuthor"
ALTER TABLE public."Topics"
ALTER COLUMN "lastAuthor" SET NOT NULL; 