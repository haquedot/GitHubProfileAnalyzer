import { Repository } from "@/types/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RepositoryListProps {
  repositories: Repository[]
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Repositories</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {repositories.map((repo) => (
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {repo.description && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-4">
                {repo.language && (
                  <span className="text-sm font-medium">{repo.language}</span>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span className="text-sm">{repo.forks_count}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(repo.updated_at))} ago
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}