"use client";
import {LoginDTO, loginSchema} from "@/models/User/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useLogin} from "@/features/auth/api/use-login";
import {useRouter} from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const loginQuery = useLogin({
    onSuccess: () => {
      router.push("/");
    },
  });
  const form = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginDTO) => {
    await loginQuery.mutateAsync({
      ...values,
    });
    if (!loginQuery.isError) {
      router.push("/");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Seu email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Sua senha..." {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loginQuery.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
