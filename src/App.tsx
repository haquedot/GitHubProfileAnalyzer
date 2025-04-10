import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchForm } from "@/components/search-form"
import { UserProfile } from "@/components/user-profile"
import { RepositoryList } from "@/components/repository-list"
import { ActivityChart } from "@/components/activity-chart"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { GitHubUser, Repository, CommitActivity } from "@/types/github"
import { Github } from "lucide-react"

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [activity, setActivity] = useState<CommitActivity[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      };
  
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers }),
      ]);
  
      if (!userResponse.ok) {
        throw new Error(userResponse.status === 404
          ? "User not found"
          : `API Error: ${userResponse.status}`);
      }
  
      const userData = await userResponse.json();
      const reposData: Repository[] = await reposResponse.json();
  
      // Pick the first (most recently updated) repository
      const topRepo = reposData[0];
  
      let activityData: CommitActivity[] = [];
      if (topRepo) {
        const activityResponse = await fetch(
          `https://api.github.com/repos/${username}/${topRepo.name}/stats/commit_activity`,
          { headers }
        );
        activityData = await activityResponse.json();
      }
  
      setUser(userData);
      setRepos(reposData);
      setActivity(activityData || []);
    } catch (err) {
      console.error("API Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setUser(null);
      setRepos([]);
      setActivity([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen mx-auto max-w-6xl bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-8 w-8" />
              <h1 className="text-2xl font-bold">GitHub Profile Analyzer</h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="space-y-8">
            <div className="flex justify-center">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/15 p-4 text-center text-destructive">
                {error}
              </div>
            )}

            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              user && (
                <div className="space-y-8">
                  <UserProfile user={user} />
                  <ActivityChart data={activity} />
                  <RepositoryList repositories={repos} />
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App