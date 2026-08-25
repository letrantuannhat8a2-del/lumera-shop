"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/sever";

export async function login(formData: FormData) {
  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  if (!email || !password) {
    redirect(
      "/account/login?error=missing"
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    redirect(
      "/account/login?error=invalid"
    );
  }

  redirect("/account");
}