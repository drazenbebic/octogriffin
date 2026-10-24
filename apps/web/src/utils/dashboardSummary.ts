const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

/** "7 triggers across 3 repositories", shown under the dashboard heading. */
export const dashboardSummary = (triggers: number, repositories: number) =>
  `${triggers === 0 ? 'No triggers yet' : plural(triggers, 'trigger', 'triggers')} across ${plural(repositories, 'repository', 'repositories')}`;
