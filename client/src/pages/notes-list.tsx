import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  PenLine,
  Clock,
  FileText,
  Heart,
  Search,
  X,
  Star,
  Download,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Note } from "@shared/schema";
import { categories } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NotesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const handleExportNotes = () => {
    if (!notes || notes.length === 0) return;

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalNotes: notes.length,
      notes: notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        isFavorite: note.isFavorite,
        createdAt: note.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heyo-notes-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Notes exported",
      description: `${notes.length} notes have been saved to a file.`,
    });
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      id,
      isFavorite,
    }: {
      id: string;
      isFavorite: boolean;
    }) => {
      const response = await apiRequest("PATCH", `/api/notes/${id}`, {
        isFavorite,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });

  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    let result = [...notes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((note) => note.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [notes, searchQuery, categoryFilter]);

  const handleToggleFavorite = (e: React.MouseEvent, note: Note) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate({
      id: note.id,
      isFavorite: !note.isFavorite,
    });
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {notes && notes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleExportNotes}
                data-testid="button-export-notes"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
            <Link href="/create">
              <Button size="sm" className="gap-2" data-testid="button-new-note">
                <PenLine className="w-4 h-4" />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="font-romantic text-4xl md:text-5xl font-bold text-foreground mb-2">
            Sely's Notes
          </h1>
          <p className="text-muted-foreground">
            The place where memories are kept
          </p>
        </motion.div>

        {notes && notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-10 py-5 rounded-xl"
                  data-testid="input-search-notes"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-clear-search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className="w-full sm:w-48 rounded-xl"
                  data-testid="select-filter-category"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || categoryFilter !== "all") && (
              <p className="text-center text-sm text-muted-foreground">
                {filteredNotes.length === 0
                  ? "No notes match your filters"
                  : `Found ${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`}
              </p>
            )}
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-card-border">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 5) }}
              >
                <Link href={`/note/${note.id}`}>
                  <Card
                    className="border-card-border cursor-pointer transition-all duration-300 hover-elevate group relative"
                    data-testid={`card-note-${note.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1">
                          {note.title}
                        </h3>
                        <button
                          onClick={(e) => handleToggleFavorite(e, note)}
                          className={`p-1 rounded transition-colors ${
                            note.isFavorite
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          data-testid={`button-favorite-${note.id}`}
                        >
                          <Star
                            className={`w-5 h-5 ${note.isFavorite ? "fill-current" : ""}`}
                          />
                        </button>
                      </div>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                        {note.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground/70">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(new Date(note.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        {note.category && (
                          <Badge variant="secondary" className="text-xs">
                            {note.category}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : notes && notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No notes yet
            </h3>
            <p className="text-muted-foreground mb-8">
              Start writing your first note and fill this space with memories
            </p>
            <Link href="/create">
              <Button
                size="lg"
                className="gap-2"
                data-testid="button-create-first-note"
              >
                <PenLine className="w-4 h-4" />
                Create Your First Note
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No matches found
            </h3>
            <p className="text-muted-foreground mb-8">
              Try a different search term or category
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="gap-2"
              data-testid="button-clear-filters"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </motion.div>
        )}

        {notes && notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {notes.length} {notes.length === 1 ? "note" : "notes"} saved
            </span>
            <Heart className="w-4 h-4 text-primary" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
