import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Specifying multiple HTML files as entry points
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        homepage: resolve(__dirname, 'homepage.html'),
        discussion: resolve(__dirname, 'discussion.html'),
        draft_motion: resolve(__dirname, 'draft_motion.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        view_motions: resolve(__dirname, 'view_motions.html'),
        team_home: resolve(__dirname, 'team_home.html'),
        motion_archive: resolve(__dirname, 'motion_archive.html'),
        create_committee: resolve(__dirname, 'create_comittee.html'),
        // Add more pages as needed
      },
    },
  },
});
