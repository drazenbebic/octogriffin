import type { ComboboxItemType } from '@/components/ui/Combobox';

export const getGroupedGithubEvents = (): ComboboxItemType[] => [
  // Create
  {
    group: 'Create',
    label: 'Create',
    value: 'create',
  },
  // Delete
  {
    group: 'Delete',
    label: 'Delete',
    value: 'delete',
  },
  // Discussion
  {
    group: 'Discussion',
    label: 'Discussion Answered',
    value: 'discussion.answered',
  },
  {
    group: 'Discussion',
    label: 'Discussion Category Changed',
    value: 'discussion.category_changed',
  },
  {
    group: 'Discussion',
    label: 'Discussion Closed',
    value: 'discussion.closed',
  },
  {
    group: 'Discussion',
    label: 'Discussion Created',
    value: 'discussion.created',
  },
  {
    group: 'Discussion',
    label: 'Discussion Deleted',
    value: 'discussion.deleted',
  },
  {
    group: 'Discussion',
    label: 'Discussion Edited',
    value: 'discussion.edited',
  },
  {
    group: 'Discussion',
    label: 'Discussion Labeled',
    value: 'discussion.labeled',
  },
  {
    group: 'Discussion',
    label: 'Discussion Locked',
    value: 'discussion.locked',
  },
  {
    group: 'Discussion',
    label: 'Discussion Pinned',
    value: 'discussion.pinned',
  },
  {
    group: 'Discussion',
    label: 'Discussion Reopened',
    value: 'discussion.reopened',
  },
  {
    group: 'Discussion',
    label: 'Discussion Transferred',
    value: 'discussion.transferred',
  },
  {
    group: 'Discussion',
    label: 'Discussion Unlabeled',
    value: 'discussion.unlabeled',
  },
  {
    group: 'Discussion',
    label: 'Discussion Unlocked',
    value: 'discussion.unlocked',
  },
  {
    group: 'Discussion',
    label: 'Discussion Unpinned',
    value: 'discussion.unpinned',
  },
  // Discussion Comment
  {
    group: 'Discussion Comment',
    label: 'Discussion Comment Created',
    value: 'discussion_comment.created',
  },
  {
    group: 'Discussion Comment',
    label: 'Discussion Comment Deleted',
    value: 'discussion_comment.deleted',
  },
  {
    group: 'Discussion Comment',
    label: 'Discussion Comment Edited',
    value: 'discussion_comment.edited',
  },
  // Fork
  {
    group: 'Fork',
    label: 'Fork',
    value: 'fork',
  },
  // Gollum
  {
    group: 'Gollum',
    label: 'Gollum',
    value: 'gollum',
  },
  // Issue Comment
  {
    group: 'Issue Comment',
    label: 'Issue Comment Created',
    value: 'issue_comment.created',
  },
  {
    group: 'Issue Comment',
    label: 'Issue Comment Deleted',
    value: 'issue_comment.deleted',
  },
  {
    group: 'Issue Comment',
    label: 'Issue Comment Edited',
    value: 'issue_comment.edited',
  },
  // Issues
  {
    group: 'Issues',
    label: 'Issues Assigned',
    value: 'issues.assigned',
  },
  {
    group: 'Issues',
    label: 'Issues Closed',
    value: 'issues.closed',
  },
  {
    group: 'Issues',
    label: 'Issues Deleted',
    value: 'issues.deleted',
  },
  {
    group: 'Issues',
    label: 'Issues Demilestoned',
    value: 'issues.demilestoned',
  },
  {
    group: 'Issues',
    label: 'Issues Edited',
    value: 'issues.edited',
  },
  {
    group: 'Issues',
    label: 'Issues Labeled',
    value: 'issues.labeled',
  },
  {
    group: 'Issues',
    label: 'Issues Locked',
    value: 'issues.locked',
  },
  {
    group: 'Issues',
    label: 'Issues Milestoned',
    value: 'issues.milestoned',
  },
  {
    group: 'Issues',
    label: 'Issues Opened',
    value: 'issues.opened',
  },
  {
    group: 'Issues',
    label: 'Issues Pinned',
    value: 'issues.pinned',
  },
  {
    group: 'Issues',
    label: 'Issues Reopened',
    value: 'issues.reopened',
  },
  {
    group: 'Issues',
    label: 'Issues Transferred',
    value: 'issues.transferred',
  },
  {
    group: 'Issues',
    label: 'Issues Typed',
    value: 'issues.typed',
  },
  {
    group: 'Issues',
    label: 'Issues Unassigned',
    value: 'issues.unassigned',
  },
  {
    group: 'Issues',
    label: 'Issues Unlabeled',
    value: 'issues.unlabeled',
  },
  {
    group: 'Issues',
    label: 'Issues Unlocked',
    value: 'issues.unlocked',
  },
  {
    group: 'Issues',
    label: 'Issues Unpinned',
    value: 'issues.unpinned',
  },
  {
    group: 'Issues',
    label: 'Issues Untyped',
    value: 'issues.untyped',
  },
  // Label
  {
    group: 'Label',
    label: 'Label Created',
    value: 'label.created',
  },
  {
    group: 'Label',
    label: 'Label Deleted',
    value: 'label.deleted',
  },
  {
    group: 'Label',
    label: 'Label Edited',
    value: 'label.edited',
  },
  // Milestone
  {
    group: 'Milestone',
    label: 'Milestone Closed',
    value: 'milestone.closed',
  },
  {
    group: 'Milestone',
    label: 'Milestone Created',
    value: 'milestone.created',
  },
  {
    group: 'Milestone',
    label: 'Milestone Deleted',
    value: 'milestone.deleted',
  },
  {
    group: 'Milestone',
    label: 'Milestone Edited',
    value: 'milestone.edited',
  },
  {
    group: 'Milestone',
    label: 'Milestone Opened',
    value: 'milestone.opened',
  },
  // Package
  {
    group: 'Package',
    label: 'Package Published',
    value: 'package.published',
  },
  {
    group: 'Package',
    label: 'Package Updated',
    value: 'package.updated',
  },
  // Pull Request
  {
    group: 'Pull Request',
    label: 'Pull Request Assigned',
    value: 'pull_request.assigned',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Closed',
    value: 'pull_request.closed',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Converted to Draft',
    value: 'pull_request.converted_to_draft',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Dequeued',
    value: 'pull_request.dequeued',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Edited',
    value: 'pull_request.edited',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Enqueued',
    value: 'pull_request.enqueued',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Labeled',
    value: 'pull_request.labeled',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Locked',
    value: 'pull_request.locked',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Opened',
    value: 'pull_request.opened',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Ready for Review',
    value: 'pull_request.ready_for_review',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Reopened',
    value: 'pull_request.reopened',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Review Request Removed',
    value: 'pull_request.review_request_removed',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Review Requested',
    value: 'pull_request.review_requested',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Synchronize',
    value: 'pull_request.synchronize',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Unassigned',
    value: 'pull_request.unassigned',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Unlabeled',
    value: 'pull_request.unlabeled',
  },
  {
    group: 'Pull Request',
    label: 'Pull Request Unlocked',
    value: 'pull_request.unlocked',
  },
  // Pull Request Review
  {
    group: 'Pull Request Review',
    label: 'Pull Request Review Dismissed',
    value: 'pull_request_review.dismissed',
  },
  {
    group: 'Pull Request Review',
    label: 'Pull Request Review Edited',
    value: 'pull_request_review.edited',
  },
  {
    group: 'Pull Request Review',
    label: 'Pull Request Review Submitted',
    value: 'pull_request_review.submitted',
  },
  // Pull Request Review Comment
  {
    group: 'Pull Request Review Comment',
    label: 'Pull Request Review Comment Created',
    value: 'pull_request_review_comment.created',
  },
  {
    group: 'Pull Request Review Comment',
    label: 'Pull Request Review Comment Deleted',
    value: 'pull_request_review_comment.deleted',
  },
  {
    group: 'Pull Request Review Comment',
    label: 'Pull Request Review Comment Edited',
    value: 'pull_request_review_comment.edited',
  },
  // Pull Request Review Thread
  {
    group: 'Pull Request Review Thread',
    label: 'Pull Request Review Thread Resolved',
    value: 'pull_request_review_thread.resolved',
  },
  {
    group: 'Pull Request Review Thread',
    label: 'Pull Request Review Thread Unresolved',
    value: 'pull_request_review_thread.unresolved',
  },
  // Push
  {
    group: 'Push',
    label: 'Push to Repository',
    value: 'push',
  },
  // Release
  {
    group: 'Release',
    label: 'Release Created',
    value: 'release.created',
  },
  {
    group: 'Release',
    label: 'Release Deleted',
    value: 'release.deleted',
  },
  {
    group: 'Release',
    label: 'Release Edited',
    value: 'release.edited',
  },
  {
    group: 'Release',
    label: 'Release Prereleased',
    value: 'release.prereleased',
  },
  {
    group: 'Release',
    label: 'Release Published',
    value: 'release.published',
  },
  {
    group: 'Release',
    label: 'Release Released',
    value: 'release.released',
  },
  {
    group: 'Release',
    label: 'Release Unpublished',
    value: 'release.unpublished',
  },
  // Repository
  {
    group: 'Repository',
    label: 'Repository Archived',
    value: 'repository.archived',
  },
  {
    group: 'Repository',
    label: 'Repository Created',
    value: 'repository.created',
  },
  {
    group: 'Repository',
    label: 'Repository Deleted',
    value: 'repository.deleted',
  },
  {
    group: 'Repository',
    label: 'Repository Edited',
    value: 'repository.edited',
  },
  {
    group: 'Repository',
    label: 'Repository Privatized',
    value: 'repository.privatized',
  },
  {
    group: 'Repository',
    label: 'Repository Publicized',
    value: 'repository.publicized',
  },
  {
    group: 'Repository',
    label: 'Repository Renamed',
    value: 'repository.renamed',
  },
  {
    group: 'Repository',
    label: 'Repository Transferred',
    value: 'repository.transferred',
  },
  {
    group: 'Repository',
    label: 'Repository Unarchived',
    value: 'repository.unarchived',
  },
  // Star
  {
    group: 'Star',
    label: 'Star Created',
    value: 'star.created',
  },
  {
    group: 'Star',
    label: 'Star Deleted',
    value: 'star.deleted',
  },
  // Workflow Dispatch
  {
    group: 'Workflow Dispatch',
    label: 'Workflow Dispatch',
    value: 'workflow_dispatch',
  },
  // Workflow Job
  {
    group: 'Workflow Job',
    label: 'Workflow Job Completed',
    value: 'workflow_job.completed',
  },
  {
    group: 'Workflow Job',
    label: 'Workflow Job In Progress',
    value: 'workflow_job.in_progress',
  },
  {
    group: 'Workflow Job',
    label: 'Workflow Job Queued',
    value: 'workflow_job.queued',
  },
  {
    group: 'Workflow Job',
    label: 'Workflow Job Waiting',
    value: 'workflow_job.waiting',
  },
  // Workflow Run
  {
    group: 'Workflow Run',
    label: 'Workflow Run Completed',
    value: 'workflow_run.completed',
  },
  {
    group: 'Workflow Run',
    label: 'Workflow Run In Progress',
    value: 'workflow_run.in_progress',
  },
  {
    group: 'Workflow Run',
    label: 'Workflow Run Requested',
    value: 'workflow_run.requested',
  },
];
