import { NextPage } from 'next';
import { Metadata } from 'next';
import Link from 'next/link';

import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { supportEmail } from '@/utils/supportEmail';

export const metadata: Metadata = {
  title: 'Imprint',
  description:
    'Legal disclosure and provider identification for Octogriffin. Operated by Drazen Bebic in Vienna, Austria.',
};

const Imprint: NextPage = () => {
  const email = supportEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <Heading level={1} className="mb-4">
          Imprint
        </Heading>
        <Content size="lg">Legal Disclosure</Content>
      </div>

      <div className="flex flex-col gap-10">
        {/* 1. Information according to § 5 ECG */}
        <section>
          <Heading level={2} size="xl" className="mb-4">
            Information according to § 5 ECG
          </Heading>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Heading level={3} size="base" className="mb-1">
                Media Owner & Publisher
              </Heading>
              <Content className="font-medium">
                Drazen Bebic
                <br />
                Postfatch 0029 1190 Vienna
                <br />
                Austria
              </Content>
            </div>

            <div>
              <Heading level={3} size="base" className="mb-1">
                Contact
              </Heading>
              <Content>
                <span className="block">
                  <span className="font-medium text-slate-900">Email:</span>{' '}
                  <Link
                    href={`mailto:${email}`}
                    className="text-violet-600 hover:underline"
                  >
                    {email}
                  </Link>
                </span>
              </Content>
            </div>
          </div>
        </section>

        {/* 2. Business Details */}
        <section>
          <Heading level={2} size="xl" className="mb-4">
            Business Details
          </Heading>
          <div className="space-y-4">
            <div>
              <Heading level={3} size="base" className="mb-1">
                Business Purpose
              </Heading>
              <Content>
                Development and distribution of software, specifically web
                applications and GitHub integrations.
              </Content>
            </div>

            <div>
              <Heading level={3} size="base" className="mb-1">
                Applicable Legislation
              </Heading>
              <Content>
                GewO (Trade Regulation Act), ECG (E-Commerce Act).
                <br />
                Authority: Magistrat der Stadt Wien.
              </Content>
            </div>
          </div>
        </section>

        {/* 3. Dispute Resolution */}
        <section>
          <Heading level={2} size="xl" className="mb-4">
            EU Dispute Resolution
          </Heading>
          <Content>
            In accordance with the Regulation on Online Dispute Resolution in
            Consumer Matters (ODR Regulation), we would like to inform you about
            the Online Dispute Resolution Platform (OS Platform).
            <br />
            Consumers have the opportunity to submit complaints to the European
            Commission&apos;s Online Dispute Resolution platform at:
            <br />
            <Link
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-violet-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </Link>
          </Content>
        </section>

        {/* 4. Liability & Copyright */}
        <section className="rounded-2xl bg-slate-50 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <Heading level={3} size="lg" className="mb-2">
                Liability for Content
              </Heading>
              <Content size="sm">
                The contents of our pages have been created with the utmost
                care. However, we cannot guarantee the contents&apos; accuracy,
                completeness, or topicality. According to statutory provisions,
                we are furthermore responsible for our own content on these web
                pages. In this context, please note that we are accordingly not
                obliged to monitor merely the transmitted or saved information
                of third parties, or investigate circumstances pointing to
                illegal activity.
              </Content>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-2">
                Liability for Links
              </Heading>
              <Content size="sm">
                Responsibility for the content of external links (to web pages
                of third parties) lies solely with the operators of the linked
                pages. No violations were evident to us at the time of linking.
                Should any legal infringement become known to us, we will remove
                the respective link immediately.
              </Content>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-2">
                Copyright
              </Heading>
              <Content size="sm">
                Our web pages and their contents are subject to Austrian
                copyright law. Unless expressly permitted by law (§ 44a et seq.
                of the copyright law), every form of utilizing, reproducing, or
                processing works subject to copyright protection on our web
                pages requires the prior consent of the respective owner of the
                rights. Individual reproductions of a work are allowed only for
                private use, so must not serve either directly or indirectly for
                earnings.
              </Content>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Imprint;
