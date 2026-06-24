class TagManager {}

type Tag = string;

class TagGroup {
    tags: Set<Tag> = new Set();
    constructor(tags: Tag[] = []) {
        tags.forEach((tag) => this.tags.add(tag));
    }

    has(tag: Tag | TagGroup): boolean {
        if (tag instanceof TagGroup) {
            for (const t of tag.tags) {
                if (!this.tags.has(t)) {
                    return false;
                }
            }
            return true;
        }
        return this.tags.has(tag);
    }

    add(tag: Tag | TagGroup): void {
        if (tag instanceof TagGroup) {
            tag.tags.forEach((t) => this.tags.add(t));
        } else if (typeof tag !== 'string') {
            this.tags.add(tag);
        }
    }

    remove(tag: Tag | TagGroup): void {
        if (tag instanceof TagGroup) {
            tag.tags.forEach((t) => this.tags.delete(t));
        } else {
            this.tags.delete(tag);
        }
    }
    clear(): void {
        this.tags.clear();
    }
}
{
    function test() {
        
        const tag1: Tag = 'tag1';
        const tag2: Tag = 'tag2';
        const tag3: Tag = 'tag3';

        const group1 = new TagGroup([tag1, tag2]);
        const group2 = new TagGroup([tag2, tag3]);

        const manager = new TagGroup();
        manager.add(group1);
        manager.add(tag3);

        console.log(manager.has(group1)); // true
        console.log(manager.has(group2)); // false

        manager.remove(tag2);
        console.log(manager.has(group1)); // false

    }

    test();
}

