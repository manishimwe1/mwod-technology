import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { handleSignInWithGoogle } from "@/lib/actions/signinActions";

const SignInButton = () => {
  return (
    <div>
      <form action={handleSignInWithGoogle}>
        <Button
          type="submit"
          variant="outline"
          className="h-12 w-full cursor-pointer rounded-xl bg-white dark:bg-stone-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Image
            src={"/google.svg"}
            className="size-4"
            alt="google logo"
            width={3}
            height={3}
          />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sign in with Google</p>
        </Button>
      </form>
    </div>
  );
};



export default SignInButton;
