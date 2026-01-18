'use client';

import { useState } from 'react';

import { AddTriggerModal } from '@/components/dashboard/AddTriggerModal';
import { DeleteTriggerModal } from '@/components/dashboard/DeleteTriggerModal';
import { EditTriggerModal } from '@/components/dashboard/EditTriggerModal';
import { TriggersList } from '@/components/dashboard/TriggersList';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { TriggerWithRepos } from '@/types/triggers';

export default function Page() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<TriggerWithRepos | null>(
    null,
  );
  const [deletingTrigger, setDeletingTrigger] = useState<TriggersModel | null>(
    null,
  );

  return (
    <>
      <TriggersList
        onOpenCreateAction={() => setCreateModalOpen(true)}
        onOpenDeleteAction={trigger => setDeletingTrigger(trigger)}
        onOpenEditAction={trigger =>
          setEditingTrigger(trigger as TriggerWithRepos)
        }
      />
      <AddTriggerModal
        open={isCreateModalOpen}
        setOpenAction={setCreateModalOpen}
        onSuccessAction={() => {
          setCreateModalOpen(false);
        }}
      />

      {editingTrigger && (
        <EditTriggerModal
          key={`edit-${editingTrigger.uuid}`}
          trigger={editingTrigger}
          open={!!editingTrigger}
          setOpenAction={open => {
            if (!open) {
              setEditingTrigger(null);
            }
          }}
          onSuccessAction={() => {
            setEditingTrigger(null);
          }}
        />
      )}

      {deletingTrigger && (
        <DeleteTriggerModal
          key={`delete-${deletingTrigger.uuid}`}
          trigger={deletingTrigger}
          open={!!deletingTrigger}
          setOpenAction={open => {
            if (!open) {
              setDeletingTrigger(null);
            }
          }}
          onSuccessAction={() => {
            setEditingTrigger(null);
          }}
        />
      )}
    </>
  );
}
