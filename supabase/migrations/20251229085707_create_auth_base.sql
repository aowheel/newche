CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE TABLE "public"."line_accounts" (
    "sub" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "profile_id" uuid NOT NULL
);

ALTER TABLE "public"."line_accounts" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "display_name" text,
    "avatar_url" text,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX line_accounts_pkey ON public.line_accounts USING btree (sub);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

ALTER TABLE "public"."line_accounts"
    ADD CONSTRAINT "line_accounts_pkey" PRIMARY KEY USING INDEX "line_accounts_pkey";

ALTER TABLE "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY USING INDEX "profiles_pkey";

ALTER TABLE "public"."line_accounts"
    ADD CONSTRAINT "line_accounts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles (id) NOT valid;

ALTER TABLE "public"."line_accounts" validate CONSTRAINT "line_accounts_profile_id_fkey";

ALTER TABLE "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."profiles" validate CONSTRAINT "profiles_id_fkey";

GRANT DELETE ON TABLE "public"."line_accounts" TO "anon";

GRANT INSERT ON TABLE "public"."line_accounts" TO "anon";

GRANT REFERENCES ON TABLE "public"."line_accounts" TO "anon";

GRANT SELECT ON TABLE "public"."line_accounts" TO "anon";

GRANT TRIGGER ON TABLE "public"."line_accounts" TO "anon";

GRANT TRUNCATE ON TABLE "public"."line_accounts" TO "anon";

GRANT UPDATE ON TABLE "public"."line_accounts" TO "anon";

GRANT DELETE ON TABLE "public"."line_accounts" TO "authenticated";

GRANT INSERT ON TABLE "public"."line_accounts" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."line_accounts" TO "authenticated";

GRANT SELECT ON TABLE "public"."line_accounts" TO "authenticated";

GRANT TRIGGER ON TABLE "public"."line_accounts" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."line_accounts" TO "authenticated";

GRANT UPDATE ON TABLE "public"."line_accounts" TO "authenticated";

GRANT DELETE ON TABLE "public"."line_accounts" TO "service_role";

GRANT INSERT ON TABLE "public"."line_accounts" TO "service_role";

GRANT REFERENCES ON TABLE "public"."line_accounts" TO "service_role";

GRANT SELECT ON TABLE "public"."line_accounts" TO "service_role";

GRANT TRIGGER ON TABLE "public"."line_accounts" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."line_accounts" TO "service_role";

GRANT UPDATE ON TABLE "public"."line_accounts" TO "service_role";

GRANT DELETE ON TABLE "public"."profiles" TO "anon";

GRANT INSERT ON TABLE "public"."profiles" TO "anon";

GRANT REFERENCES ON TABLE "public"."profiles" TO "anon";

GRANT SELECT ON TABLE "public"."profiles" TO "anon";

GRANT TRIGGER ON TABLE "public"."profiles" TO "anon";

GRANT TRUNCATE ON TABLE "public"."profiles" TO "anon";

GRANT UPDATE ON TABLE "public"."profiles" TO "anon";

GRANT DELETE ON TABLE "public"."profiles" TO "authenticated";

GRANT INSERT ON TABLE "public"."profiles" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."profiles" TO "authenticated";

GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";

GRANT TRIGGER ON TABLE "public"."profiles" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."profiles" TO "authenticated";

GRANT UPDATE ON TABLE "public"."profiles" TO "authenticated";

GRANT DELETE ON TABLE "public"."profiles" TO "service_role";

GRANT INSERT ON TABLE "public"."profiles" TO "service_role";

GRANT REFERENCES ON TABLE "public"."profiles" TO "service_role";

GRANT SELECT ON TABLE "public"."profiles" TO "service_role";

GRANT TRIGGER ON TABLE "public"."profiles" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."profiles" TO "service_role";

GRANT UPDATE ON TABLE "public"."profiles" TO "service_role";

CREATE POLICY "Authenticated users can view profiles" ON "public"."profiles" AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE TRIGGER update_line_tokens_moddatetime
    BEFORE UPDATE ON public.line_accounts
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime ('updated_at');

CREATE TRIGGER update_profiles_moddatetime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime ('updated_at');

