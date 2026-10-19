'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DomainEnrollButtonProps {
  domainId: string;
  domainName: string;
  isAuthenticated: boolean;
  hasActiveEnrollment: boolean;
  isEnrolledInThisDomain: boolean;
}

export const DomainEnrollButton: React.FC<DomainEnrollButtonProps> = ({
  domainId,
  domainName,
  isAuthenticated,
  hasActiveEnrollment,
  isEnrolledInThisDomain,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/register?domain=${domainId}`);
      return;
    }

    if (isEnrolledInThisDomain) {
      router.push('/dashboard');
      return;
    }

    if (hasActiveEnrollment) {
      setError('You already have an ongoing active enrollment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_id: domainId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Enrollment failed.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Enrollment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {error && (
        <div className="text-[11px] text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isEnrolledInThisDomain ? (
        <Button
          onClick={handleEnroll}
          variant="success"
          size="sm"
          className="w-full"
          leftIcon={<Check className="w-3.5 h-3.5" />}
        >
          Currently Enrolled (Go to Tasks)
        </Button>
      ) : (
        <Button
          onClick={handleEnroll}
          isLoading={loading}
          variant={isAuthenticated && hasActiveEnrollment ? 'outline' : 'primary'}
          size="sm"
          className="w-full"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          disabled={isAuthenticated && hasActiveEnrollment}
        >
          {isAuthenticated && hasActiveEnrollment
            ? 'Ongoing Enrollment Active'
            : `Enroll in ${domainName}`}
        </Button>
      )}
    </div>
  );
};
