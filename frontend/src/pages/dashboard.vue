<script setup lang="ts">
import { Icon } from "@iconify/vue";
type DashboardRoutes = {
    path: string;
    title: string;
    icon: string;
};
const dashboardRoutes: DashboardRoutes[] = [
    {
        path: "/medicos",
        title: "Médicos",
        icon: "lucide:clipboard-pen",
    },
    {
        path: "/pacientes",
        title: "Pacientes",
        icon: "lucide:users-round",
    },
];
</script>
<template>
    <section class="flex">
        <nav class="h-screen w-48 text-2xl shadow-md shadow-l">
            <ul>
                <li
                    v-for="route in dashboardRoutes"
                    :key="route.path"
                    class="flex flex-row gap-2 items-center justify-center hover:bg-secondary hover:cursor-pointer p-2"
                >
                    <Icon
                        :icon="route.icon"
                        class="text-secondary-foreground"
                    />
                    {{ route.title }}
                </li>
            </ul>
        </nav>
        <RouterView />
    </section>
</template>
