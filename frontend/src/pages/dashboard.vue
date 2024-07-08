<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
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
    {
        path: "/atendimentos",
        title: "Atendimentos",
        icon: "lucide:album",
    },
];

const defaultDashboardState = () => {
    return window.innerWidth > 1024;
};

const isDashboardRoutesOpen = ref(false);

const toggleDashboardRoutes = () => {
    isDashboardRoutesOpen.value = !isDashboardRoutesOpen.value;
};

onMounted(() => {
    isDashboardRoutesOpen.value = defaultDashboardState();
});
</script>

<template>
    <section class="flex">
        <nav class="h-screen w-fit text-2xl shadow-md shadow-l py-0">
            <div class="w-full h-fit flex justify-start px-2 my-2 items-center">
                <Button variant="outline" @click="toggleDashboardRoutes">
                    <Icon icon="lucide:align-center" class="w-full h-full" />
                </Button>
            </div>

            <ul v-if="isDashboardRoutesOpen" class="transition-all animate-in">
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
            <ul v-else class="animate-out transition-all">
                <li
                    v-for="route in dashboardRoutes"
                    :key="route.path"
                    class="flex flex-row gap-2 items-center justify-center hover:bg-secondary hover:cursor-pointer p-2"
                >
                    <Icon
                        :icon="route.icon"
                        class="text-secondary-foreground"
                    />
                </li>
            </ul>
        </nav>
        <RouterView />
    </section>
</template>
