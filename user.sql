--
-- PostgreSQL database dump
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    public_id character varying(50),
    email character varying(50) NOT NULL,
    password character varying(80) NOT NULL,
    admin boolean NOT NULL,
    phone character varying(20) NOT NULL
);




CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);




SELECT pg_catalog.setval('public.user_id_seq', 8, true);



ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_public_id_key UNIQUE (public_id);

