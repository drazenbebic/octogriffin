'use client';

import { useState } from 'react';

import { DeleteTriggerModal } from '@/components/dashboard/DeleteTriggerModal';
import { TriggerModal } from '@/components/dashboard/TriggerModal';
import { TriggersList } from '@/components/dashboard/TriggersList';
import { TriggersModel } from '@/generated/prisma/models/Triggers';
import { TriggerWithRepos } from '@/types/triggers';

export default function DashboardPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<null | TriggerWithRepos>(
    null,
  );
  const [deletingTrigger, setDeletingTrigger] = useState<null | TriggersModel>(
    null,
  );

  const handleOpenCreate = () => {
    setEditingTrigger(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (trigger: TriggersModel) => {
    setEditingTrigger(trigger as TriggerWithRepos);
    setModalOpen(true);
  };

  return (
    <>
      <TriggersList
        onOpenCreateAction={handleOpenCreate}
        onOpenDeleteAction={trigger => setDeletingTrigger(trigger)}
        onOpenEditAction={handleOpenEdit}
      />

      <TriggerModal
        key={editingTrigger ? `edit-${editingTrigger.uuid}` : 'create'}
        onSuccessAction={() => {
          setModalOpen(false);
          setEditingTrigger(null);
        }}
        open={isModalOpen}
        setOpenAction={setModalOpen}
        trigger={editingTrigger || undefined}
      />

      {deletingTrigger && (
        <DeleteTriggerModal
          key={`delete-${deletingTrigger.uuid}`}
          onSuccessAction={() => {
            setEditingTrigger(null);
          }}
          open={!!deletingTrigger}
          setOpenAction={open => {
            if (!open) {
              setDeletingTrigger(null);
            }
          }}
          trigger={deletingTrigger}
        />
      )}
    </>
  );
}
