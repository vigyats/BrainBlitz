import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Hash, Heart, BookOpen, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Note } from "@shared/schema";
import { categories } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NoteDetail() {
  const params = useParams<{ id: string }>();
  const noteId = params.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<string | null>(null);

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["/api/notes", noteId],
    enabled: !!noteId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { title?: string; content?: string; category?: string | null; isFavorite?: boolean }) => {
      const response = await apiRequest("PATCH", `/api/notes/${noteId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsEditing(false);
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      });
      navigate("/notes");
    },
    onError: () => {
      toast({
        title: "Failed to delete",
        description: "Could not delete the note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartEdit = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditCategory(note.category);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditCategory(null);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      updateMutation.mutate({ 
        title: editTitle, 
        content: editContent,
        category: editCategory
      });
    }
  };

  const handleToggleFavorite = () => {
    if (note) {
      updateMutation.mutate({ isFavorite: !note.isFavorite });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Card className="border-card-border">
            <CardContent className="p-8">
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Note not found
          </h2>
          <p className="text-muted-foreground mb-8">
            This note may have been deleted or doesn't exist
          </p>
          <Link href="/notes">
            <Button size="lg" className="gap-2" data-testid="button-go-to-notes">
              <ArrowLeft className="w-4 h-4" />
              Back to Notes
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link href="/notes">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              data-testid="button-back-to-notes"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notes
            </Button>
          </Link>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${note.isFavorite ? "text-primary" : ""}`}
                onClick={handleToggleFavorite}
                disabled={updateMutation.isPending}
                data-testid="button-toggle-favorite"
              >
                <Star className={`w-4 h-4 ${note.isFavorite ? "fill-current" : ""}`} />
                {note.isFavorite ? "Favorited" : "Favorite"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleStartEdit}
                data-testid="button-edit-note"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    data-testid="button-delete-note"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-testid="button-confirm-delete"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl md:text-3xl font-bold font-romantic py-6 px-4 rounded-xl"
                placeholder="Note title"
                data-testid="input-edit-title"
              />
            </div>

            <div className="mb-6">
              <Select 
                value={editCategory || undefined} 
                onValueChange={(value) => setEditCategory(value)}
              >
                <SelectTrigger className="w-48 rounded-xl" data-testid="select-edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Card className="border-card-border mb-6">
              <CardContent className="p-6 md:p-8">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-64 text-lg resize-none border-0 p-0 focus-visible:ring-0 leading-relaxed"
                  placeholder="Note content"
                  data-testid="input-edit-content"
                />
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending || !editTitle.trim() || !editContent.trim()}
                className="gap-2"
                data-testid="button-save-edit"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="gap-2"
                data-testid="button-cancel-edit"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                {note.isFavorite && (
                  <Star className="w-6 h-6 text-primary fill-current" />
                )}
                <h1 
                  className="font-romantic text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                  data-testid="text-note-title"
                >
                  {note.title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span data-testid="text-note-date">
                    {format(new Date(note.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span 
                    className="font-mono text-xs"
                    data-testid="text-note-id"
                  >
                    {note.id.slice(0, 8)}
                  </span>
                </div>
                {note.category && (
                  <Badge variant="secondary" data-testid="text-note-category">
                    {note.category}
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-card-border">
                <CardContent className="p-6 md:p-8">
                  <p 
                    className="text-lg leading-relaxed text-foreground whitespace-pre-wrap"
                    data-testid="text-note-content"
                  >
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
            >
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm">A memory preserved</span>
              <Heart className="w-4 h-4 text-primary" />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
