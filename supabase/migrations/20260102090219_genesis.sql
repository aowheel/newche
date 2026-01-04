CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE TYPE "public"."line_connect_status" AS enum (
    'not_connected',
    'pending',
    'connected'
);

CREATE TYPE "public"."workspace_role" AS enum (
    'admin',
    'member'
);

CREATE TABLE "public"."line_accounts" (
    "id" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "profile_id" uuid
);

ALTER TABLE "public"."line_accounts" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "display_name" text,
    "bio" text,
    "avatar_url" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles_workspaces" (
    "profile_id" uuid NOT NULL,
    "workspace_id" uuid NOT NULL,
    "role" public.workspace_role NOT NULL DEFAULT 'member'::public.workspace_role
);

ALTER TABLE "public"."profiles_workspaces" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."workspaces" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid (),
    "title" text,
    "description" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "line_connect_status" public.line_connect_status NOT NULL DEFAULT 'not_connected'::public.line_connect_status,
    "line_group_id" text
);

ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX line_accounts_pkey ON public.line_accounts USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_workspaces_pkey ON public.profiles_workspaces USING btree (profile_id, workspace_id);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspaces USING btree (id);

ALTER TABLE "public"."line_accounts"
    ADD CONSTRAINT "line_accounts_pkey" PRIMARY KEY USING INDEX "line_accounts_pkey";

ALTER TABLE "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY USING INDEX "profiles_pkey";

ALTER TABLE "public"."profiles_workspaces"
    ADD CONSTRAINT "profiles_workspaces_pkey" PRIMARY KEY USING INDEX "profiles_workspaces_pkey";

ALTER TABLE "public"."workspaces"
    ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY USING INDEX "workspaces_pkey";

ALTER TABLE "public"."line_accounts"
    ADD CONSTRAINT "line_accounts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles (id) NOT valid;

ALTER TABLE "public"."line_accounts" validate CONSTRAINT "line_accounts_profile_id_fkey";

ALTER TABLE "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."profiles" validate CONSTRAINT "profiles_id_fkey";

ALTER TABLE "public"."profiles_workspaces"
    ADD CONSTRAINT "profiles_workspaces_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles (id) NOT valid;

ALTER TABLE "public"."profiles_workspaces" validate CONSTRAINT "profiles_workspaces_profile_id_fkey";

ALTER TABLE "public"."profiles_workspaces"
    ADD CONSTRAINT "profiles_workspaces_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES public.workspaces (id) NOT valid;

ALTER TABLE "public"."profiles_workspaces" validate CONSTRAINT "profiles_workspaces_workspace_id_fkey";

ALTER TABLE "public"."workspaces"
    ADD CONSTRAINT "workspaces_line_connected_requires_group" CHECK (((line_connect_status <> 'connected'::public.line_connect_status) OR (line_group_id IS NOT NULL))) NOT valid;

ALTER TABLE "public"."workspaces" validate CONSTRAINT "workspaces_line_connected_requires_group";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.handle_workspace_create ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO 'public'
    AS $function$
BEGIN
    IF auth.uid () IS NULL THEN
        RETURN NEW;
    END IF;
    INSERT INTO public.profiles_workspaces (profile_id, workspace_id, role)
        VALUES (auth.uid (), NEW.id, 'admin')
    ON CONFLICT
        DO NOTHING;
    RETURN NEW;
END;
$function$;

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

GRANT DELETE ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT INSERT ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT REFERENCES ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT SELECT ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT TRIGGER ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT TRUNCATE ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT UPDATE ON TABLE "public"."profiles_workspaces" TO "anon";

GRANT DELETE ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT INSERT ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT SELECT ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT TRIGGER ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT UPDATE ON TABLE "public"."profiles_workspaces" TO "authenticated";

GRANT DELETE ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT INSERT ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT REFERENCES ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT SELECT ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT TRIGGER ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT UPDATE ON TABLE "public"."profiles_workspaces" TO "service_role";

GRANT DELETE ON TABLE "public"."workspaces" TO "anon";

GRANT INSERT ON TABLE "public"."workspaces" TO "anon";

GRANT REFERENCES ON TABLE "public"."workspaces" TO "anon";

GRANT SELECT ON TABLE "public"."workspaces" TO "anon";

GRANT TRIGGER ON TABLE "public"."workspaces" TO "anon";

GRANT TRUNCATE ON TABLE "public"."workspaces" TO "anon";

GRANT UPDATE ON TABLE "public"."workspaces" TO "anon";

GRANT DELETE ON TABLE "public"."workspaces" TO "authenticated";

GRANT INSERT ON TABLE "public"."workspaces" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."workspaces" TO "authenticated";

GRANT SELECT ON TABLE "public"."workspaces" TO "authenticated";

GRANT TRIGGER ON TABLE "public"."workspaces" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."workspaces" TO "authenticated";

GRANT UPDATE ON TABLE "public"."workspaces" TO "authenticated";

GRANT DELETE ON TABLE "public"."workspaces" TO "service_role";

GRANT INSERT ON TABLE "public"."workspaces" TO "service_role";

GRANT REFERENCES ON TABLE "public"."workspaces" TO "service_role";

GRANT SELECT ON TABLE "public"."workspaces" TO "service_role";

GRANT TRIGGER ON TABLE "public"."workspaces" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."workspaces" TO "service_role";

GRANT UPDATE ON TABLE "public"."workspaces" TO "service_role";

CREATE POLICY "Authenticated users can update own profile" ON "public"."profiles" AS permissive
    FOR UPDATE TO authenticated
        USING ((id = auth.uid ()))
        WITH CHECK ((id = auth.uid ()));

CREATE POLICY "Authenticated users can view profiles" ON "public"."profiles" AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY "Authenticated users can view own profiles_workspaces" ON "public"."profiles_workspaces" AS permissive
    FOR SELECT TO authenticated
        USING ((profile_id = auth.uid ()));

CREATE POLICY "Authenticated users can create workspaces" ON "public"."workspaces" AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (TRUE);

CREATE POLICY "Workspace admins can update workspaces" ON "public"."workspaces" AS permissive
    FOR UPDATE TO authenticated
        USING ((EXISTS (
            SELECT
                1
            FROM
                public.profiles_workspaces pw
            WHERE ((pw.workspace_id = workspaces.id) AND (pw.profile_id = auth.uid ()) AND (pw.role = 'admin'::public.workspace_role)))))
        WITH CHECK ((EXISTS (
            SELECT
                1
            FROM
                public.profiles_workspaces pw
            WHERE ((pw.workspace_id = workspaces.id) AND (pw.profile_id = auth.uid ()) AND (pw.role = 'admin'::public.workspace_role)))));

CREATE POLICY "Workspace members can view workspaces" ON "public"."workspaces" AS permissive
    FOR SELECT TO authenticated
        USING ((EXISTS (
            SELECT
                1
            FROM
                public.profiles_workspaces pw
            WHERE ((pw.workspace_id = workspaces.id) AND (pw.profile_id = auth.uid ())))));

CREATE TRIGGER update_line_tokens_moddatetime
    BEFORE UPDATE ON public.line_accounts
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime ('updated_at');

CREATE TRIGGER update_profiles_moddatetime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime ('updated_at');

CREATE TRIGGER handle_workspace_create
    AFTER INSERT ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_workspace_create ();

CREATE TRIGGER update_workspaces_moddatetime
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime ('updated_at');
