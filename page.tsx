import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products } = await supabase.from('products').select();

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
