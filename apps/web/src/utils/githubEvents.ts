export const getGroupedGithubEvents = () => {
  return [
    {
      name: 'create__parent',
      label: 'Create Branch or Tag',
      items: [
        {
          value: 'create',
          label: 'Create',
        },
      ],
    },
    {
      name: 'delete__parent',
      label: 'Delete Branch or Tag',
      items: [
        {
          value: 'delete',
          label: 'Delete',
        },
      ],
    },
    {
      name: 'discussion',
      label: 'Discussion',
      items: [
        {
          value: 'discussion.answered',
          label: 'Discussion Answered',
        },
        {
          value: 'discussion.category_changed',
          label: 'Discussion Category Changed',
        },
        {
          value: 'discussion.closed',
          label: 'Discussion Closed',
        },
        {
          value: 'discussion.created',
          label: 'Discussion Created',
        },
        {
          value: 'discussion.deleted',
          label: 'Discussion Deleted',
        },
        {
          value: 'discussion.edited',
          label: 'Discussion Edited',
        },
        {
          value: 'discussion.labeled',
          label: 'Discussion Labeled',
        },
        {
          value: 'discussion.locked',
          label: 'Discussion Locked',
        },
        {
          value: 'discussion.pinned',
          label: 'Discussion Pinned',
        },
        {
          value: 'discussion.reopened',
          label: 'Discussion Reopened',
        },
        {
          value: 'discussion.transferred',
          label: 'Discussion Transferred',
        },
        {
          value: 'discussion.unlabeled',
          label: 'Discussion Unlabeled',
        },
        {
          value: 'discussion.unlocked',
          label: 'Discussion Unlocked',
        },
        {
          value: 'discussion.unpinned',
          label: 'Discussion Unpinned',
        },
      ],
    },
    {
      name: 'discussion_comment',
      label: 'Discussion Comment',
      items: [
        {
          value: 'discussion_comment.created',
          label: 'Discussion Comment Created',
        },
        {
          value: 'discussion_comment.deleted',
          label: 'Discussion Comment Deleted',
        },
        {
          value: 'discussion_comment.edited',
          label: 'Discussion Comment Edited',
        },
      ],
    },
    {
      name: 'fork__parent',
      label: 'Repository forked',
      items: [
        {
          value: 'fork',
          label: 'Fork',
        },
      ],
    },
    {
      name: 'gollum__parent',
      label: 'Wiki page updated',
      items: [
        {
          value: 'gollum',
          label: 'Gollum',
        },
      ],
    },
    {
      name: 'issue_comment',
      label: 'Issue Comment',
      items: [
        {
          value: 'issue_comment.created',
          label: 'Issue Comment Created',
        },
        {
          value: 'issue_comment.deleted',
          label: 'Issue Comment Deleted',
        },
        {
          value: 'issue_comment.edited',
          label: 'Issue Comment Edited',
        },
      ],
    },
    {
      name: 'issues',
      label: 'Issues',
      items: [
        {
          value: 'issues.assigned',
          label: 'Issues Assigned',
        },
        {
          value: 'issues.closed',
          label: 'Issues Closed',
        },
        {
          value: 'issues.deleted',
          label: 'Issues Deleted',
        },
        {
          value: 'issues.demilestoned',
          label: 'Issues Demilestoned',
        },
        {
          value: 'issues.edited',
          label: 'Issues Edited',
        },
        {
          value: 'issues.labeled',
          label: 'Issues Labeled',
        },
        {
          value: 'issues.locked',
          label: 'Issues Locked',
        },
        {
          value: 'issues.milestoned',
          label: 'Issues Milestoned',
        },
        {
          value: 'issues.opened',
          label: 'Issues Opened',
        },
        {
          value: 'issues.pinned',
          label: 'Issues Pinned',
        },
        {
          value: 'issues.reopened',
          label: 'Issues Reopened',
        },
        {
          value: 'issues.transferred',
          label: 'Issues Transferred',
        },
        {
          value: 'issues.typed',
          label: 'Issues Typed',
        },
        {
          value: 'issues.unassigned',
          label: 'Issues Unassigned',
        },
        {
          value: 'issues.unlabeled',
          label: 'Issues Unlabeled',
        },
        {
          value: 'issues.unlocked',
          label: 'Issues Unlocked',
        },
        {
          value: 'issues.unpinned',
          label: 'Issues Unpinned',
        },
        {
          value: 'issues.untyped',
          label: 'Issues Untyped',
        },
      ],
    },
    {
      name: 'label',
      label: 'Label',
      items: [
        {
          value: 'label.created',
          label: 'Label Created',
        },
        {
          value: 'label.deleted',
          label: 'Label Deleted',
        },
        {
          value: 'label.edited',
          label: 'Label Edited',
        },
      ],
    },
    {
      name: 'milestone',
      label: 'Milestone',
      items: [
        {
          value: 'milestone.closed',
          label: 'Milestone Closed',
        },
        {
          value: 'milestone.created',
          label: 'Milestone Created',
        },
        {
          value: 'milestone.deleted',
          label: 'Milestone Deleted',
        },
        {
          value: 'milestone.edited',
          label: 'Milestone Edited',
        },
        {
          value: 'milestone.opened',
          label: 'Milestone Opened',
        },
      ],
    },
    {
      name: 'package',
      label: 'Package',
      items: [
        {
          value: 'package.published',
          label: 'Package Published',
        },
        {
          value: 'package.updated',
          label: 'Package Updated',
        },
      ],
    },
    {
      name: 'pull_request',
      label: 'Pull Request',
      items: [
        {
          value: 'pull_request.assigned',
          label: 'Pull Request Assigned',
        },
        {
          value: 'pull_request.closed',
          label: 'Pull Request Closed',
        },
        {
          value: 'pull_request.converted_to_draft',
          label: 'Pull Request Converted to Draft',
        },
        {
          value: 'pull_request.dequeued',
          label: 'Pull Request Dequeued',
        },
        {
          value: 'pull_request.edited',
          label: 'Pull Request Edited',
        },
        {
          value: 'pull_request.enqueued',
          label: 'Pull Request Enqueued',
        },
        {
          value: 'pull_request.labeled',
          label: 'Pull Request Labeled',
        },
        {
          value: 'pull_request.locked',
          label: 'Pull Request Locked',
        },
        {
          value: 'pull_request.opened',
          label: 'Pull Request Opened',
        },
        {
          value: 'pull_request.ready_for_review',
          label: 'Pull Request Ready for Review',
        },
        {
          value: 'pull_request.reopened',
          label: 'Pull Request Reopened',
        },
        {
          value: 'pull_request.review_request_removed',
          label: 'Pull Request Review Request Removed',
        },
        {
          value: 'pull_request.review_requested',
          label: 'Pull Request Review Requested',
        },
        {
          value: 'pull_request.synchronize',
          label: 'Pull Request Synchronize',
        },
        {
          value: 'pull_request.unassigned',
          label: 'Pull Request Unassigned',
        },
        {
          value: 'pull_request.unlabeled',
          label: 'Pull Request Unlabeled',
        },
        {
          value: 'pull_request.unlocked',
          label: 'Pull Request Unlocked',
        },
      ],
    },
    {
      name: 'pull_request_review',
      label: 'Pull Request review',
      items: [
        {
          value: 'pull_request_review.dismissed',
          label: 'Pull Request Review Dismissed',
        },
        {
          value: 'pull_request_review.edited',
          label: 'Pull Request Review Edited',
        },
        {
          value: 'pull_request_review.submitted',
          label: 'Pull Request Review Submitted',
        },
      ],
    },
    {
      name: 'pull_request_review_comment',
      label: 'Pull Request Review Comment',
      items: [
        {
          value: 'pull_request_review_comment.created',
          label: 'Pull Request Review Comment Created',
        },
        {
          value: 'pull_request_review_comment.deleted',
          label: 'Pull Request Review Comment Deleted',
        },
        {
          value: 'pull_request_review_comment.edited',
          label: 'Pull Request Review Comment Edited',
        },
      ],
    },
    {
      name: 'pull_request_review_thread',
      label: 'Pull Request Review Thread',
      items: [
        {
          value: 'pull_request_review_thread.resolved',
          label: 'Pull Request Review Thread Resolved',
        },
        {
          value: 'pull_request_review_thread.unresolved',
          label: 'Pull Request Review Thread Unresolved',
        },
      ],
    },
    {
      name: 'parent__push',
      label: 'Push',
      items: [
        {
          value: 'push',
          label: 'Push to Repository',
        },
      ],
    },
    {
      name: 'release',
      label: 'Release',
      items: [
        {
          value: 'release.created',
          label: 'Release Created',
        },
        {
          value: 'release.deleted',
          label: 'Release Deleted',
        },
        {
          value: 'release.edited',
          label: 'Release Edited',
        },
        {
          value: 'release.prereleased',
          label: 'Release Prereleased',
        },
        {
          value: 'release.published',
          label: 'Release Published',
        },
        {
          value: 'release.released',
          label: 'Release Released',
        },
        {
          value: 'release.unpublished',
          label: 'Release Unpublished',
        },
      ],
    },
    {
      name: 'repository',
      label: 'Repository',
      items: [
        {
          value: 'repository.archived',
          label: 'Repository Archived',
        },
        {
          value: 'repository.created',
          label: 'Repository Created',
        },
        {
          value: 'repository.deleted',
          label: 'Repository Deleted',
        },
        {
          value: 'repository.edited',
          label: 'Repository Edited',
        },
        {
          value: 'repository.privatized',
          label: 'Repository Privatized',
        },
        {
          value: 'repository.publicized',
          label: 'Repository Publicized',
        },
        {
          value: 'repository.renamed',
          label: 'Repository Renamed',
        },
        {
          value: 'repository.transferred',
          label: 'Repository Transferred',
        },
        {
          value: 'repository.unarchived',
          label: 'Repository Unarchived',
        },
      ],
    },
    {
      name: 'star',
      label: 'Star',
      items: [
        {
          value: 'star.created',
          label: 'Star Created',
        },
        {
          value: 'star.deleted',
          label: 'Star Deleted',
        },
      ],
    },
    {
      name: 'workflow_dispatch__parent',
      label: 'Workflow Dispatch',
      items: [
        {
          value: 'workflow_dispatch',
          label: 'Workflow Dispatch',
        },
      ],
    },
    {
      name: 'workflow_job',
      label: 'Workflow Job',
      items: [
        {
          value: 'workflow_job.completed',
          label: 'Workflow Job Completed',
        },
        {
          value: 'workflow_job.in_progress',
          label: 'Workflow Job In Progress',
        },
        {
          value: 'workflow_job.queued',
          label: 'Workflow Job Queued',
        },
        {
          value: 'workflow_job.waiting',
          label: 'Workflow Job Waiting',
        },
      ],
    },
    {
      name: 'workflow_run',
      label: 'Workflow Run',
      items: [
        {
          value: 'workflow_run.completed',
          label: 'Workflow Run Completed',
        },
        {
          value: 'workflow_run.in_progress',
          label: 'Workflow Run In Progress',
        },
        {
          value: 'workflow_run.requested',
          label: 'Workflow Run Requested',
        },
      ],
    },
  ];
};
