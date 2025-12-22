import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, User, CheckCircle } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useToast } from '@/hooks/use-toast';

const newsletterSchema = z.object({
  firstName: z.string().min(1, 'Please enter your first name'),
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterPopup = ({ isOpen, onClose }: NewsletterPopupProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'duplicate'>('idle');
  const { addSubscriber } = useSubscribers();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    try {
      await addSubscriber({
        firstName: data.firstName,
        email: data.email,
        source: 'email-list',
        status: 'active',
      });
      setSubmitStatus('success');
      toast({
        title: 'Successfully subscribed!',
        description: 'Thank you for joining our newsletter.',
      });
      setTimeout(() => {
        onClose();
        reset();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      if (errorMessage === 'Email already subscribed') {
        setSubmitStatus('duplicate');
        toast({
          title: 'Already subscribed',
          description: 'This email is already on our list. Thank you!',
        });
        setTimeout(() => {
          onClose();
          reset();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90vw] max-w-[400px] mx-auto animate-in fade-in-0 zoom-in-95 duration-300 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl font-heading font-bold text-foreground">
            Subscribe to Our Newsletter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <p className="text-center text-muted-foreground text-sm sm:text-base px-2">
            Get marketing tips and offers straight to your inbox.
          </p>

          {submitStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600 py-3 sm:py-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Successfully subscribed!</span>
            </div>
          )}

          {submitStatus === 'duplicate' && (
            <div className="flex items-center justify-center gap-2 text-blue-600 py-3 sm:py-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Already subscribed!</span>
            </div>
          )}

          {submitStatus === 'idle' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  <Input
                    {...register('firstName')}
                    type="text"
                    placeholder="Enter your first name"
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs sm:text-sm text-destructive px-1">{errors.firstName.message}</p>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs sm:text-sm text-destructive px-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};