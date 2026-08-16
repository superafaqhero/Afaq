<?php
declare(strict_types=1);

// Keep one source of truth while supporting hosts that prioritize index.php.
readfile(__DIR__ . DIRECTORY_SEPARATOR . 'index.html');
