"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid verification link",
        variant: "destructive",
      });
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        toast({
          title: "Email verified",
          description: "Your email has been verified successfully.",
        });
        
        // Redirect to login page after successful verification
        setTimeout(() => {
          router.push('/login');
        }, 2000);

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to verify email. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        {isVerifying ? (
          <p>Verifying your email...</p>
        ) : (
          <div className="space-y-4">
            <p>If you're not redirected automatically, click below:</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}