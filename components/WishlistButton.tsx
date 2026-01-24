'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  className = '',
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      checkWishlistStatus();
    }
  }, [session, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const wishlist = await response.json();
        setIsInWishlist(
          wishlist.some((item: any) => item.productId === productId)
        );
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsInWishlist(false);
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(true);
        } else {
          const data = await response.json();
          if (data.error === 'Product already in wishlist') {
            setIsInWishlist(true);
          } else {
            throw new Error(data.error || 'Failed to add to wishlist');
          }
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`${className} ${
        isInWishlist
          ? 'text-red-500 fill-red-500'
          : 'text-gray-400 hover:text-red-500'
      } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className="h-6 w-6"
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
    </button>
  );
}
