package com.fptu.eduBoostBackend.entities;

import com.fptu.eduBoostBackend.entities.enums.Relationship;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "parent_student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentStudent {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship", nullable = false, length = 20)
    private Relationship relationship;

    @PrePersist
    @PreUpdate
    private void ensureUnique() {
        // Unique constraint is handled by database, but we can add validation here if needed
    }
}
