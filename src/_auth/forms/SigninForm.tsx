import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {  Form,  FormControl,  FormDescription,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccountMutation } from "@/lib/react-querry/QueriesAndMutaiton"
import { useUserContext } from "@/context/AuthContext"

 
const formSchema = z.object({
    username: z.string().min(2).max(50),
})



const SigninForm = () => {

    const { toast } = useToast()
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
    const { mutateAsync: signInAcc, isPending :isSigningIn } = useSignInAccountMutation();

    
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })
   

    async function onSubmit(values: z.infer<typeof SigninValidation>) {

      const session = await signInAcc( {email: values.email, password: values.password})
    
        if(!session){
            return toast({title:"sign in failed, try again"})
        }

        const isloggedIn = await checkAuthUser();

        if(isloggedIn) {
            form.reset();
            navigate('/');
        }else {
            return toast({title:"sign up failed, try again"})
        }

    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo"/>
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Log in to your account</h2>
            <p className="text-light-3 small-medium md:base-regulare"> welcum back, enter your acc detail</p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-5">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                        <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="shad-button_primary">
                {isUserLoading ? (
                    <div className="flex-center gap-2">
                    <Loader/> loading...
                    </div>
                ): "Sign up"}
                </Button>
                <p className="text-small-regular text-light-2 text-center"> 
                don't have acc? 
                <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">sign-up</Link>
                </p>
            </form>
            </div>
        </Form>
    )
}

export default SigninForm