<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('achievements')) {
            Schema::table('achievements', function (Blueprint $table) {
                if (!Schema::hasColumn('achievements', 'image')) {
                    $table->string('image')->nullable()->after('icon');
                }
            });
        }

        if (Schema::hasTable('gallery_items')) {
            Schema::table('gallery_items', function (Blueprint $table) {
                if (!Schema::hasColumn('gallery_items', 'category')) {
                    $table->string('category')->default('all')->after('alt');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('achievements')) {
            Schema::table('achievements', function (Blueprint $table) {
                if (Schema::hasColumn('achievements', 'image')) {
                    $table->dropColumn('image');
                }
            });
        }

        if (Schema::hasTable('gallery_items')) {
            Schema::table('gallery_items', function (Blueprint $table) {
                if (Schema::hasColumn('gallery_items', 'category')) {
                    $table->dropColumn('category');
                }
            });
        }
    }
};
