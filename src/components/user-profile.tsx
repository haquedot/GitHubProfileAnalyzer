import { GitHubUser } from "@/types/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, GitFork, Star } from "lucide-react"

interface UserProfileProps {
  user: GitHubUser
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              @{user.login}
            </a>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user.bio && <p className="mb-4 text-muted-foreground">{user.bio}</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{user.followers} followers</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{user.following} following</span>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4" />
            <span className="text-sm font-medium">{user.public_repos} repos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}