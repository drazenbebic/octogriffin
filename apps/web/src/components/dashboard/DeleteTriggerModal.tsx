'use client';

import { FC, useTransition } from 'react';

import { DialogProvider } from '@ariakit/react';
import { Delete02Icon } from 'hugeicons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DialogDismiss } from '@/components/ui/DialogDismiss';
import { Heading } from '@/components/ui/Heading';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useTriggersStore } from '@/store/useTriggersStore';

export type DeleteWebhookTriggerModalProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  trigger: TriggersModel;
  onSuccessAction?: () => void;
};

export const DeleteTriggerModal: FC<DeleteWebhookTriggerModalProps> = ({
  open,
  setOpenAction,
  trigger,
  onSuccessAction,
}) => {
  const deleteTrigger = useTriggersStore(state => state.deleteTrigger);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const deletedTrigger = await deleteTrigger(trigger.uuid);

      if (deletedTrigger) {
        toast.success('Trigger deleted successfully');
        setOpenAction(false);
        onSuccessAction?.();
      } else {
        toast.error('Failed to delete trigger', {
          description: 'Please try again later.',
        });
      }
    });
  };

  return (
    <DialogProvider open={open} setOpen={setOpenAction}>
      <Dialog>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Delete02Icon size={20} />
            </div>
            <Heading as="h2" size="lg">
              Delete Trigger?
            </Heading>
          </div>
          <DialogDismiss label="Close the delete webhook trigger modal" />
        </div>

        <div className="mb-8">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the{' '}
            <strong className="text-slate-900">{trigger.taskTitle}</strong>{' '}
            trigger? This action cannot be undone and you will stop receiving
            rewards for this event.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setOpenAction(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            isLoading={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Trigger
          </Button>
        </div>
      </Dialog>
    </DialogProvider>
  );
};
