import { AnchorLink } from '@/components/AnchorLink';
import { LocaleSync } from '@/components/LocaleSync';
import { ResearchResults } from '@/components/ResearchResults';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SkipLink } from '@/components/SkipLink';

export default function ResearchPage() {
  return <>
    <SkipLink locale="en" />
    <main className="research-page" id="main" lang="en" tabIndex={-1}>
      <LocaleSync locale="en" />
      <SiteHeader locale="en" view="research" pathSuffix="/research" />
      <ResearchResults locale="en" LinkComponent={AnchorLink} projectHref={(slug) => `/en/projects/${slug}`} />
    </main>
    <SiteFooter locale="en" />
  </>;
}
