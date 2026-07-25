export default function Footer() {
  return (
    <footer className="w-full border-t border-secondary bg-surface py-3 px-4 text-center text-xs text-text-muted select-none shrink-0">
      <p>&copy; {new Date().getFullYear()} TaskMatrix. All rights reserved.</p>
    </footer>
  );
}
