UPDATE public."Topics"
SET "lastAuthor" = 'Desconocido'
WHERE "lastAuthor" IS NULL OR "lastAuthor" = '';

UPDATE public."Topics"
SET "lastAuthorID" = 0
WHERE "lastAuthorID" IS NULL;

ALTER TABLE public."Topics"
ALTER COLUMN "lastAuthor" SET DEFAULT 'Desconocido';