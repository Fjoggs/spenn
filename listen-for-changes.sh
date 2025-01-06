while true;
  do inotifywait --exclude spenn.sqlite-wal -e modify ./* && bun bundle;
done
