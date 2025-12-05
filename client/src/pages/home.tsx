import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PenLine, BookOpen, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1
            data-testid="text-heyo-greeting"
            className="font-romantic text-7xl md:text-8xl lg:text-9xl font-bold text-primary tracking-tight"
          >
            Heyo!
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed"
          data-testid="text-tagline"
        >
          For Some of the most beautiful memories{" "}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col gap-4 w-full max-w-sm mx-auto"
        >
          <Link href="/create">
            <Button
              size="lg"
              className="w-full py-6 text-lg font-medium rounded-xl gap-3"
              data-testid="button-create-note"
            >
              <PenLine className="w-5 h-5" />
              Create a New Note
            </Button>
          </Link>

          <Link href="/notes">
            <Button
              size="lg"
              variant="outline"
              className="w-full py-6 text-lg font-medium rounded-xl gap-3"
              data-testid="button-read-notes"
            >
              <BookOpen className="w-5 h-5" />
              Read Old Notes
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm">Sely</span>
          <Heart className="w-4 h-4 text-primary" />
        </motion.div>
      </motion.div>
    </div>
  );
}
