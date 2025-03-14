import Link from 'next/link'
 
import { Button } from '@/components/ui/button';
export default async function NotFoundPage() {
  return (
    <>
      <div className="container mx-auto py-20 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-4xl">Oops, 404</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Button>
            <Link href="/">
                Go back to home
            </Link>
        </Button>
      </div>
    </>
  );
}
