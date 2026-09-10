"use client";

import {Building2, Heart, ShieldCheck, ArrowRight} from "lucide-react";

import { useRouter } from "next/navigation";



export default function SobreNosPage() {

     const router = useRouter();


    return (
        <main className="min-h-screen bg-[#F7F5F0] text-[#292825]">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="border-b border-[#E3E0D9] bg-[#F7F5F0]">

                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

                    <div className="max-w-4xl">

                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A8883]">
                            Sobre a Vitta
                        </p>

                        <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-[#292825] sm:text-6xl lg:text-7xl">
                            Encontrar um imóvel é
                            <span className="block text-[#8A8883]">
                                encontrar seu lugar.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-base leading-8 text-[#77746E] sm:text-lg">
                            Somos uma imobiliária dedicada a conectar
                            pessoas aos imóveis que mais combinam com
                            seus objetivos, necessidades e estilo de vida.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                INTRODUÇÃO
            ===================================================== */}

            <section className="bg-white py-24 sm:py-28">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                                Nossa essência
                            </p>

                            <h2 className="mt-4 max-w-xl text-4xl font-medium leading-tight tracking-[-0.03em] text-[#292825] sm:text-5xl">
                                Uma experiência mais simples,
                                <span className="block text-[#8A8883]">
                                    transparente e próxima.
                                </span>
                            </h2>

                        </div>


                        <div className="max-w-xl">

                            <p className="text-base leading-8 text-[#77746E]">
                                A Vitta nasceu com o propósito de tornar
                                a busca por um novo imóvel mais clara,
                                tranquila e acessível.
                            </p>

                            <p className="mt-5 text-base leading-8 text-[#77746E]">
                                Acreditamos que encontrar um imóvel vai
                                muito além de escolher um endereço.
                                É encontrar um espaço que faça sentido
                                para o momento e para os planos de cada
                                pessoa.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                VALORES
            ===================================================== */}

        <section
            className="relative bg-cover bg-[center_20%] bg-no-repeat py-24 sm:py-28"
            style={{
                backgroundImage: "url('/images/sobrenos.jpg')",
            }}
        >

            {/* Overlay */}

            <div className="absolute inset-0 bg-[#F7F5F0]/50" />


            {/* Conteúdo */}

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                <div className="-mt-10 mb-2">

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#292825]">
                        O que nos guia
                    </p>

                    <h2 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-[#292825]">
                        Nossos valores
                    </h2>
                    <br></br>

                </div>


                <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#DDDAD3] bg-[#DDDAD3] md:grid-cols-3">

                    {/* IMÓVEIS */}

                    <div className="bg-white/95 p-8 sm:p-10">

                        <div className="flex h-12 w-12 items-center justify-center text-[#55534E]">
                            <Building2
                                size={23}
                                strokeWidth={1.5}
                            />

                        </div>

                        <h3 className="mt-7 text-xl font-medium tracking-tight text-[#292825]">
                            Bons imóveis
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#77746E]">
                            Buscamos oferecer opções de imóveis
                            para diferentes necessidades, momentos
                            e estilos de vida.
                        </p>

                    </div>


                    {/* SEGURANÇA */}

                    <div className="bg-white/95 p-8 sm:p-10">

                        <div className="flex h-12 w-12 items-center justify-center text-[#55534E]">
                            <ShieldCheck
                                size={23}
                                strokeWidth={1.5}
                            />

                        </div>

                        <h3 className="mt-7 text-xl font-medium tracking-tight text-[#292825]">
                            Segurança
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#77746E]">
                            Valorizamos uma experiência segura,
                            transparente e responsável durante
                            todo o processo.
                        </p>

                    </div>


                    {/* ATENDIMENTO */}

                    <div className="bg-white/95 p-8 sm:p-10">

                        <div className="flex h-12 w-12 items-center justify-center text-[#55534E]">
                            <Heart
                                size={23}
                                strokeWidth={1.5}
                            />

                        </div>

                        <h3 className="mt-7 text-xl font-medium tracking-tight text-[#292825]">
                            Atendimento
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#77746E]">
                            Estamos aqui para entender suas
                            necessidades e ajudar você a encontrar
                            uma opção que realmente faça sentido.
                        </p>

                    </div>

                </div>

            </div>

        </section>



            {/* =====================================================
                DIFERENCIAL
            ===================================================== */}

            <section className="border-y border-[#E3E0D9] bg-white py-24 sm:py-28">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">

                        <div className="order-2 lg:order-1">

                            <div className="border-l border-[#292825] pl-7">

                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                                    VITTA
                                </p>

                                <p className="mt-5 text-3xl font-medium leading-tight tracking-[-0.03em] text-[#292825] sm:text-4xl">
                                    O imóvel certo não é apenas
                                    aquele que você encontra.
                                    <span className="block text-[#8A8883]">
                                        É aquele que combina com você.
                                    </span>
                                </p>

                            </div>

                        </div>


                        <div className="order-1 max-w-xl lg:order-2">

                            <p className="text-base leading-8 text-[#77746E]">
                                Por isso, buscamos deixar cada etapa
                                da jornada mais simples: desde a busca
                                pelo imóvel até o momento de tomar
                                uma decisão.
                            </p>

                            <p className="mt-5 text-base leading-8 text-[#77746E]">
                                Nossa proposta é unir tecnologia,
                                praticidade e atendimento para que
                                você tenha mais tranquilidade ao
                                encontrar seu próximo endereço.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="bg-[#292825] py-20">

                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center lg:px-8">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
                            Seu próximo endereço
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                            Vamos encontrar o lugar certo para você.
                        </h2>

                    </div>


                        <button
                            type="button"
                            onClick={() =>
                                router.push("/imoveis")
                            }
                            className="group shrink-0 cursor-pointer bg-white px-7 py-3.5 text-sm font-semibold text-[#292825] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F1F0ED] hover:text-[#171614]"
                        >
                            <span className="inline-flex items-center gap-2">
                                Ver imóveis
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </span>
                        </button>
                </div>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="bg-[#F7F5F0]">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4">


                        {/* MARCA */}

                        <div className="md:col-span-2">

                            <a
                                href="/"
                                className="inline-block"
                            >

                                <span className="block text-2xl font-semibold tracking-[0.16em] text-[#292825]">
                                    VITTA
                                </span>

                                <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-[#8A8883]">
                                    IMOBILIÁRIA
                                </span>

                            </a>

                            <p className="mt-6 max-w-sm text-sm leading-7 text-[#77746E]">
                                Encontre imóveis que combinam com você
                                e descubra um lugar para chamar de lar.
                            </p>

                        </div>


                        {/* NAVEGAÇÃO */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Navegação
                            </h3>

                            <div className="mt-5 flex flex-col gap-3">

                                <a
                                    href="/"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Início
                                </a>

                                <a
                                    href="/imoveis"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Imóveis
                                </a>

                                <a
                                    href="/sobrenos"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Sobre nós
                                </a>

                                <a
                                    href="/login"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Entrar
                                </a>

                            </div>

                        </div>


                        {/* ATENDIMENTO */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Atendimento
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746E]">

                                <span>
                                    Segunda a sexta 08:00 às 18:00
                                </span>

                                <a
                                    href="/atendimento"
                                    className="transition hover:text-[#292825]"
                                >
                                    Fale conosco →
                                </a>

                            </div>

                        </div>

                    </div>


                    {/* COPYRIGHT */}

                     <div className="mt-12 border-t border-[#E7E5E0] pt-6">

                        <p className="text-center text-xs text-[#A19E98]">
                            © {new Date().getFullYear()} Vitta Imobiliária.
                            Todos os direitos reservados.
                        </p>

                    </div>
                </div>

            </footer>

        </main>
    );
}
