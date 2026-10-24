'use client';

import type { FC } from 'react';
import { useTransition } from 'react';

import { DialogProvider } from '@ariakit/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Dialog } from '@/components/ui/Dialog';
import { DialogDismiss } from '@/components/ui/DialogDismiss';
import { Heading } from '@/components/ui/Heading';
import type { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useTriggersStore } from '@/store/useTriggersStore';

export type DeleteWebhookTriggerModalProps = {
  onSuccessAction?: () => void;
  open: boolean;
  setOpenAction: (open: boolean) => void;
  trigger: TriggersModel;
};

export const DeleteTriggerModal: FC<DeleteWebhookTriggerModalProps> = ({
  onSuccessAction,
  open,
  setOpenAction,
  trigger,
}) => {
  const deleteTrigger = useTriggersStore(state => state.deleteTrigger);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const deletedTrigger = await deleteTrigger(trigger.uuid);

      // The store already reports failures
      if (deletedTrigger) {
        toast.success('Trigger deleted successfully');
        setOpenAction(false);
        onSuccessAction?.();
      }
    });
  };

  return (
    <DialogProvider open={open} setOpen={setOpenAction}>
      <Dialog>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hp-soft text-hp ">
              <HugeiconsIcon icon={Delete02Icon} size={20} />
            </div>
            <Heading as="h2" size="lg">
              Delete Trigger?
            </Heading>
          </div>
          <DialogDismiss label="Close the delete webhook trigger modal" />
        </div>

        <div className="mb-8">
          <Content size="sm">
            Are you sure you want to delete the{' '}
            <strong className="text-text ">{trigger.taskTitle}</strong> trigger?
            This action cannot be undone and you will stop receiving rewards for
            this event.
          </Content>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            disabled={isPending}
            onClick={() => setOpenAction(false)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button isLoading={isPending} onClick={handleDelete} variant="danger">
            Delete Trigger
          </Button>
        </div>
      </Dialog>
    </DialogProvider>
  );
};
