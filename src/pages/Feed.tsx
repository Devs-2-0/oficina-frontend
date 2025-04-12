import { FeedList } from "@/components/dashboard/feed-list"
import { PageHeader } from "@/components/dashboard/page-header"

const Feed = () => {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Feed" description="Acompanhe as últimas atualizações e comunicados" />
      <FeedList />
    </div>
  )
}

export default Feed