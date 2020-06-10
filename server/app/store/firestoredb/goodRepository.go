package firestoredb

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/dzrry/go-next-web-app/app/models"
	"github.com/dzrry/go-next-web-app/app/store"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type GoodRepository struct {
	store *Store
}

// GetGoods is a method to read goods from db
func (r *GoodRepository) GetGoods() []*models.Good {
	result := r.store.client.Collection("goods").Documents(context.Background())

	goods := make([]*models.Good, 0)

	for {
		doc, err := result.Next()
		if err == iterator.Done {
			break
		}

		g := fromMapToStruct(doc.Data(), doc.Ref.ID)
		goods = append(goods, g)
	}

	return goods
}

// GetGood is a function to get a one good from db
func (r *GoodRepository) GetGood(id string) (*models.Good, error) {
	g := &models.Good{}
	result, err := r.store.client.Collection("goods").Doc(id).Get(context.Background())
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, store.ErrDocNotFound
		}
		return nil, err
	}

	g = fromMapToStruct(result.Data(), result.Ref.ID)

	return g, nil
}

// CreateGood is a method to create a good in Db
func (r *GoodRepository) CreateGood(g *models.Good) error {
	if err := g.Validate(); err != nil {
		return err
	}

	_, _, err := r.store.client.Collection("goods").Add(context.Background(), map[string]interface{}{
		"name":        g.Name,
		"description": g.Description,
		"price":       g.Price,
	})
	if err != nil {
		return err
	}

	return nil
}

// DeleteGood is a function to delete good from db
func (r *GoodRepository) DeleteGood(id string) error {
	_, err := r.store.client.Collection("goods").Doc(id).Delete(context.Background())
	if err != nil {
		return err
	}

	return nil
}

// UpdateGood is a function to update good in db
func (r *GoodRepository) UpdateGood(g *models.Good) error {
	doc, err := r.store.client.Collection("goods").Doc(g.ID).Get(context.Background())
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return store.ErrDocNotFound
		}

		return err
	}

	ng, err := compareDocs(doc.Data(), g)
	if err != nil {
		return err
	}

	_, err = r.store.client.Collection("goods").Doc(g.ID).Set(context.Background(), map[string]interface{}{
		"name":        ng.Name,
		"description": ng.Description,
		"price":       ng.Price,
	})
	if err != nil {
		return err
	}

	return nil
}

func fromMapToStruct(gm map[string]interface{}, id string) *models.Good {
	g := &models.Good{
		ID:          id,
		Name:        gm["name"].(string),
		Description: gm["description"].(string),
		Price:       int(gm["price"].(int64)),
	}

	return g
}

func compareDocs(doc map[string]interface{}, g *models.Good) (*models.Good, error) {
	var interf map[string]interface{}
	inrec, _ := json.Marshal(g)
	json.Unmarshal(inrec, &interf)

	fmt.Println(g)

	delete(interf, "id")

	for key, value := range interf {
		if value == "" {
			delete(interf, key)
			interf[key] = doc[key]
		}
	}

	fmt.Println(interf)

	ng := &models.Good{}

	jsonMap, err := json.Marshal(interf)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonMap, ng); err != nil {
		return nil, err
	}

	fmt.Println(ng)

	return ng, nil
}
