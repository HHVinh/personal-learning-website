import { Database } from '@cloudflare/d1';
import { Resource } from '@/types';

export async function seed(db: Database) {
  // Backup existing data to enable restore on failure (simulate atomicity)
  const backupResult = await db.prepare('SELECT * FROM resources').all();
  const backupRows = (backupResult.results ?? []) as any as Resource[];
  let cleared = false;

  try {
    // Clear existing data
    await db.exec('DELETE FROM resources');
    cleared = true;

    // Sample documents for Tin A
    await db.exec(
      `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
        ('Tài liệu React cơ bản', 'Giới thiệu về React hooks và components', 'document', 'tin_a', 'https://example.com/react-basics.pdf', 1),
        ('Next.js 14 App Router', 'Hướng dẫn sử dụng App Router mới', 'document', 'tin_a', 'https://example.com/nextjs-app-router.pdf', 2),
        ('TypeScript Handbook', 'Sách hướng dẫn TypeScript đầy đủ', 'document', 'tin_a', 'https://example.com/typescript.pdf', 3)`
    );

    // Sample videos for Tin A
    await db.exec(
      `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
        ('React Tutorial 2024', 'Video hướng dẫn React từ cơ bản đến nâng cao', 'video', 'tin_a', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
        ('Next.js Crash Course', 'Next.js trong 100 phút', 'video', 'tin_a', 'https://www.youtube.com/watch?v=Sklc_fQBmcs', 2)`
    );

    // Sample documents for Tin B
    await db.exec(
      `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
        ('Node.js Best Practices', 'Các best practice khi làm việc với Node.js', 'document', 'tin_b', 'https://example.com/nodejs-best-practices.pdf', 1),
        ('Database Design', 'Thiết kế database hiệu quả', 'document', 'tin_b', 'https://example.com/database-design.pdf', 2)`
    );

    // Sample videos for Tin B
    await db.exec(
      `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
        ('Database Systems', 'Giới thiệu về hệ thống database', 'video', 'tin_b', 'https://www.youtube.com/watch?v=ztHopE5WnPE', 1),
        ('SQL Tutorial', 'Học SQL từ A-Z', 'video', 'tin_b', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 2)`
    );

    console.log('✅ Seeded database with sample data');
  } catch (error) {
    // Attempt to restore original data if we cleared the table
    if (cleared && backupRows.length > 0) {
      try {
        // Ensure table is empty before restore (in case of partial inserts)
        await db.exec('DELETE FROM resources');
        // Restore using batch for efficiency
        const restoreStmts = backupRows.map(row =>
          db.prepare('INSERT INTO resources (id, title, description, type, topic, url, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(row.id, row.title, row.description, row.type, row.topic, row.url, row.order_index, row.created_at)
        );
        await db.batch(restoreStmts);
        console.log('✅ Restored original data after seed failure');
      } catch (restoreError) {
        console.error('Failed to restore backup:', restoreError);
        // Data may be in inconsistent state; manual intervention needed.
      }
    }
    console.error('Seed error:', error);
    throw error;
  }
}
