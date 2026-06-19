-- Database functions and triggers for automation

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_listings_updated_at BEFORE UPDATE ON business_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update reply count on forum posts
CREATE OR REPLACE FUNCTION update_forum_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_posts 
        SET reply_count = reply_count + 1,
            last_activity_at = CURRENT_TIMESTAMP
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_posts 
        SET reply_count = reply_count - 1
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER forum_post_reply_count_trigger
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_forum_post_reply_count();

-- Function to update category post count
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_categories 
        SET post_count = post_count + 1,
            last_post_at = CURRENT_TIMESTAMP
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_categories 
        SET post_count = post_count - 1
        WHERE id = OLD.category_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER category_post_count_trigger
    AFTER INSERT OR DELETE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'attending' THEN
        UPDATE events 
        SET current_attendees = current_attendees + 1
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'attending' THEN
        UPDATE events 
        SET current_attendees = current_attendees - 1
        WHERE id = OLD.event_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'attending' AND NEW.status != 'attending' THEN
            UPDATE events 
            SET current_attendees = current_attendees - 1
            WHERE id = NEW.event_id;
        ELSIF OLD.status != 'attending' AND NEW.status = 'attending' THEN
            UPDATE events 
            SET current_attendees = current_attendees + 1
            WHERE id = NEW.event_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER event_attendee_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Function to update rating averages
CREATE OR REPLACE FUNCTION update_rating_average(table_name TEXT, record_id INTEGER)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    total_ratings INTEGER;
BEGIN
    -- Calculate new average and count based on table
    IF table_name = 'locations' THEN
        SELECT AVG(rating)::DECIMAL(3,2), COUNT(*) 
        INTO avg_rating, total_ratings
        FROM location_reviews 
        WHERE location_id = record_id AND is_approved = true;
        
        UPDATE locations 
        SET rating_average = COALESCE(avg_rating, 0),
            rating_count = total_ratings
        WHERE id = record_id;
        
    ELSIF table_name = 'products' THEN
        SELECT AVG(rating)::DECIMAL(3,2), COUNT(*) 
        INTO avg_rating, total_ratings
        FROM product_reviews 
        WHERE product_id = record_id AND is_approved = true;
        
        UPDATE products 
        SET rating_average = COALESCE(avg_rating, 0),
            rating_count = total_ratings
        WHERE id = record_id;
        
    ELSIF table_name = 'resources' THEN
        SELECT AVG(rating)::DECIMAL(3,2), COUNT(*) 
        INTO avg_rating, total_ratings
        FROM resource_ratings 
        WHERE resource_id = record_id;
        
        UPDATE resources 
        SET rating_average = COALESCE(avg_rating, 0),
            rating_count = total_ratings
        WHERE id = record_id;
        
    ELSIF table_name = 'business_listings' THEN
        SELECT AVG(rating)::DECIMAL(3,2), COUNT(*) 
        INTO avg_rating, total_ratings
        FROM business_reviews 
        WHERE business_id = record_id AND is_approved = true;
        
        UPDATE business_listings 
        SET rating_average = COALESCE(avg_rating, 0),
            rating_count = total_ratings
        WHERE id = record_id;
    END IF;
END;
$$ language 'plpgsql';

-- Triggers for rating updates
CREATE OR REPLACE FUNCTION trigger_update_location_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_rating_average('locations', NEW.location_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_rating_average('locations', OLD.location_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER location_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON location_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_location_rating();

-- Similar triggers for other rating tables
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_rating_average('products', NEW.product_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_rating_average('products', OLD.product_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER product_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_product_rating();

CREATE OR REPLACE FUNCTION trigger_update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_rating_average('resources', NEW.resource_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_rating_average('resources', OLD.resource_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER resource_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON resource_ratings
    FOR EACH ROW EXECUTE FUNCTION trigger_update_resource_rating();

CREATE OR REPLACE FUNCTION trigger_update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_rating_average('business_listings', NEW.business_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_rating_average('business_listings', OLD.business_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER business_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON business_reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_business_rating();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();