import { EmitterWebhookEventName } from '@octokit/webhooks';

// These have dedicated handler functions
export const dedicatedHandlerWebhooks = [
  // installation
  'installation.created',
  'installation.deleted',
  'installation_repositories.added',
  'installation_repositories.removed',
  'installation.suspend',
  'installation.unsuspend',
  // push
  'push',
] as const;

// These share a common handler function
export const universalHandlerWebhooks = [
  // create
  'create',
  // delete
  'delete',
  // discussion
  'discussion.answered',
  'discussion.category_changed',
  'discussion.closed',
  'discussion.created',
  'discussion.deleted',
  'discussion.edited',
  'discussion.labeled',
  'discussion.locked',
  'discussion.pinned',
  'discussion.reopened',
  'discussion.transferred',
  'discussion.unlabeled',
  'discussion.unlocked',
  'discussion.unpinned',
  // discussion_comment
  'discussion_comment.created',
  'discussion_comment.deleted',
  'discussion_comment.edited',
  // fork
  'fork',
  // gollum
  'gollum',
  // issue_comment
  'issue_comment.created',
  'issue_comment.deleted',
  'issue_comment.edited',
  // issues
  'issues.assigned',
  'issues.closed',
  'issues.deleted',
  'issues.demilestoned',
  'issues.edited',
  'issues.labeled',
  'issues.locked',
  'issues.milestoned',
  'issues.opened',
  'issues.pinned',
  'issues.reopened',
  'issues.transferred',
  'issues.typed',
  'issues.unassigned',
  'issues.unlabeled',
  'issues.unlocked',
  'issues.unpinned',
  'issues.untyped',
  // label
  'label.created',
  'label.deleted',
  'label.edited',
  // milestone
  'milestone.closed',
  'milestone.created',
  'milestone.deleted',
  'milestone.edited',
  'milestone.opened',
  // package
  'package.published',
  'package.updated',
  // pull_request
  'pull_request.assigned',
  'pull_request.closed',
  'pull_request.converted_to_draft',
  'pull_request.dequeued',
  'pull_request.edited',
  'pull_request.enqueued',
  'pull_request.labeled',
  'pull_request.locked',
  'pull_request.opened',
  'pull_request.ready_for_review',
  'pull_request.reopened',
  'pull_request.review_request_removed',
  'pull_request.review_requested',
  'pull_request.synchronize',
  'pull_request.unassigned',
  'pull_request.unlabeled',
  'pull_request.unlocked',
  // pull_request_review
  'pull_request_review.dismissed',
  'pull_request_review.edited',
  'pull_request_review.submitted',
  // pull_request_review_comment
  'pull_request_review_comment.created',
  'pull_request_review_comment.deleted',
  'pull_request_review_comment.edited',
  // pull_request_review_thread
  'pull_request_review_thread.resolved',
  'pull_request_review_thread.unresolved',
  // release
  'release.created',
  'release.deleted',
  'release.edited',
  'release.prereleased',
  'release.published',
  'release.released',
  'release.unpublished',
  // repository
  'repository.archived',
  'repository.created',
  'repository.deleted',
  'repository.edited',
  'repository.privatized',
  'repository.publicized',
  'repository.renamed',
  'repository.transferred',
  'repository.unarchived',
  // star
  'star.created',
  'star.deleted',
  // workflow_dispatch
  'workflow_dispatch',
  // workflow_job
  'workflow_job.completed',
  'workflow_job.in_progress',
  'workflow_job.queued',
  'workflow_job.waiting',
  // workflow_run
  'workflow_run.completed',
  'workflow_run.in_progress',
  'workflow_run.requested',
] as const;

export const supportedWebhooks: EmitterWebhookEventName[] = [
  ...dedicatedHandlerWebhooks,
  ...universalHandlerWebhooks,
] as const;

export type DedicatedWebhookEvents = (typeof dedicatedHandlerWebhooks)[number];
export type UniversalWebhookEvents = (typeof universalHandlerWebhooks)[number];
export type SupportedWebhookEvents = (typeof supportedWebhooks)[number];
