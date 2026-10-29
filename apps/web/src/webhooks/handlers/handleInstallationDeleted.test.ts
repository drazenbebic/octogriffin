import type { EmitterWebhookEvent } from '@octokit/webhooks';

import { deleteGithubInstallation } from '@/accessors/githubInstallation';
import logger from '@/lib/logger';

import { handleInstallationDeleted } from './handleInstallationDeleted';

jest.mock('@/accessors/githubInstallation', () => ({
  deleteGithubInstallation: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn() },
}));

const mockDelete = deleteGithubInstallation as jest.Mock;

const event = {
  payload: { installation: { id: 100 } },
} as unknown as EmitterWebhookEvent<'installation.deleted'>;

describe('handleInstallationDeleted', () => {
  it('deletes the installation', async () => {
    mockDelete.mockResolvedValue(true);

    await handleInstallationDeleted(event);

    expect(mockDelete).toHaveBeenCalledWith(100);
  });

  it('ignores an installation we never saved', async () => {
    mockDelete.mockResolvedValue(false);

    await expect(handleInstallationDeleted(event)).resolves.toBeUndefined();
    expect(logger.warn).toHaveBeenCalled();
  });

  it('fails the delivery when the data could not be deleted', async () => {
    mockDelete.mockRejectedValue(new Error('connection lost'));

    await expect(handleInstallationDeleted(event)).rejects.toThrow(
      'connection lost',
    );
  });
});
